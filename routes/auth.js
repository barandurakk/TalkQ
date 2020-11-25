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

    //delete old cloudinary picture
    if(req.user.pictureUrl.split(".").includes("cloudinary")){

      const fileArray = req.user.pictureUrl.split("/");
      const fileName = fileArray[fileArray.length-1].split(".")[0];
      cloudinary.uploader.destroy(fileName, (result) => {
        if(result){
         console.log(`${req.user.name}'s old avatar deleted successfully`);
        }
      })    
    
    }

    cloudinary.v2.uploader.upload(req.file.path,  {gravity: "center", height: 500, quality: "auto:eco", width: 500, crop: "lpad"},  (err,result)=> {
     if(err){
         req.send(err.message);
     }
     req.body.file = result.secure_url;
     req.body.fileId = result.public_id;

     User.findOneAndUpdate({_id: req.user._id}, {pictureUrl: result.url}).then(user => {
       if(!user){
         return res.status(403);
       }
       return res.send(result.secure_url);
     }).catch(err => {
       console.error(err);
       return res.status(500);
     })
     
     
    })
  
  });

};
