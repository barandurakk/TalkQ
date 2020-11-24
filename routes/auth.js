const passport = require("passport");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const User = mongoose.model("users");
const keys = require("../util/keys");

module.exports = (app, upload) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"),(req, res) => {

    res.redirect(`${keys.client_url}/panel`);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.status(200);
  });

  app.get("/api/currentUser", (req, res) => {

   res.send(req.user);
  });


  //upload avatar
  app.post("/api/avatar/upload", requireLogin, upload.single("file"), (req,res) => {

    cloudinary.v2.uploader.upload(req.file.path, (err,result)=> {
     if(err){
         req.send(err.message);
     }
     req.body.file = result.secure_url;
     req.body.fileId = result.public_id;

     User.findOneAndUpdate({_id: req.user._id}, {pictureUrl: result.url}).then(user => {
       if(!user){
         return res.status(403);
       }
       return res.send(result.url);
     }).catch(err => {
       console.error(err);
       return res.status(500);
     })
     
     
    })
  
  });

};
