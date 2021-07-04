const passport = require("passport");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const checkJWT = passport.authenticate("jwt", { session: false });
const usersController = require("../controllers/users");

module.exports = (app, upload) => {
  app.post("/api/signup", usersController.signUp);

  app.post(
    "/api/signin",
    passport.authenticate("local", { session: false }),
    usersController.signIn
  );

  app.post(
    "/api/auth/google",
    passport.authenticate("google-token", { session: false }),
    usersController.googleOAuth
  );

  app.post(
    "/api/auth/link/google",
    checkJWT,
    passport.authorize("google-token", { session: false }),
    usersController.linkGoogle
  );

  app.post("/api/auth/unlink/google", checkJWT, usersController.unlinkGoogle);

  app.get("/api/currentUser", checkJWT, usersController.getUser);

  //upload avatar
  app.post("/api/avatar/upload", checkJWT, upload.single("file"), (req, res) => {
    //delete old cloudinary picture
    if (req.user.pictureUrl.split(".").includes("cloudinary")) {
      const fileArray = req.user.pictureUrl.split("/");
      const fileName = fileArray[fileArray.length - 1].split(".")[0];
      cloudinary.uploader.destroy(fileName, (result) => {
        if (result) {
          console.log(`${req.user.name}'s old avatar deleted successfully`);
        }
      });
    }

    cloudinary.v2.uploader.upload(
      req.file.path,
      { gravity: "center", height: 500, quality: "auto:eco", width: 500, crop: "lpad" },
      (err, result) => {
        if (err) {
          req.send(err.message);
        }
        req.body.file = result.secure_url;
        req.body.fileId = result.public_id;

        User.findOneAndUpdate({ _id: req.user._id }, { pictureUrl: result.secure_url })
          .then((user) => {
            if (!user) {
              return res.status(403);
            }
            return res.send(result.secure_url);
          })
          .catch((err) => {
            console.error(err);
            return res.status(500);
          });
      }
    );
  });
};
