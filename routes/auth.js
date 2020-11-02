const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"), (req, res) => {
    res.redirect("http://localhost:3000/panel");
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.status(200);
  });

  app.get("/api/currentUser", (req, res) => {
    console.log("selam");
    res.send(req.user);
  });

};
