const keys = require("../util/keys");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GoogleTokenStrategy = require("passport-google-token").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: keys.jwtSecret,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        //Find the user in token
        const user = await User.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }

        req.user = user;
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        //finding user
        const user = await User.findOne({ "local.email": email });
        if (!user) {
          done(null, false);
        }

        user.isValidPassword(password, function (err, isMatch) {
          if (err) throw err;
          if (!isMatch) {
            return done(null, false);
          } else {
            done(null, user);
          }
        });
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleSecretId,
      proxy: true,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      // 1) When registering for the first time
      // 2) When linking account to the existing one
      try {
        //user try to link account,
        //if user's local email and google email are the same link it
        if (req.user && req.user.local.email === profile._json.email) {
          //already logged in via local. So link google account
          req.user.methods.push("google");
          req.user.google = {
            id: profile.id,
            email: profile._json.email,
          };
          await req.user.save();
          return done(null, req.user);
        } else if (req.user && req.user.local.email !== profile._json.email) {
          return done(null, false, {
            message: "You can only link Google account when emails are same!",
          });
        } else {
          // we have to create new account via google

          //is user already signup with google?
          let existingUser = await User.findOne({ "google.id": profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          //if user signup with local strategy before we gonna add google data to the user
          existingUser = await User.findOne({ "local.email": profile._json.email });
          if (existingUser) {
            //link account
            existingUser.methods.push("google");
            existingUser.google = {
              id: profile.id,
              email: profile._json.email,
            };
            await existingUser.save();
            return done(null, existingUser);
          }

          //if user is newcomer and no linkink involve, than create new user.
          const newUser = new User({
            methods: ["google"],
            google: {
              id: profile.id,
              email: profile._json.email,
            },
            name: profile.displayName,
            dateRegister: Date.now(),
            pictureUrl: `https://avatars.dicebear.com/api/human/${Math.floor(
              Math.random() * 200 + 1
            )}.svg`,
          });

          await newUser.save();
          done(null, newUser);
        }
      } catch (err) {
        console.log("err: ", err);
        done(err, false, err.message);
      }
    }
  )
);
