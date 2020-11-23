const express = require("express");
const mongoose = require("mongoose");
const keys = require("./util/keys");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer( app );
const socketIo = require("socket.io");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");

//models
require("./models/User");
require("./models/Conversation");
require("./models/Messages");
require("./models/FriendRequest");
/* -- */

//database connect
mongoose.connect(keys.mongoURI);
/* -- */

//cors stuff
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

/* -- */

//middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
/* -- */

//passport
require("./services/passport");
app.use(passport.initialize());
app.use(passport.session());

//Upload Image Configs
const multer = require("multer");
const cloudinary = require("cloudinary");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
  callback(null, Date.now() + file.originalname);
  }
  });

 const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
  return cb(new Error("Only image files are accepted!"), false);
  }
  cb(null, true);
  };
  const upload = multer({ storage: storage, fileFilter: imageFilter });
  
    cloudinary.config({
        cloud_name: keys.cloudinary_cloud_name,
        api_key: keys.cloudinary_api_key,
        api_secret: keys.cloudinary_secret_key
    });
    
//----------


//socket io
const io = socketIo(http, {wsEngine: "ws"});
require("./services/socket")(io);

/* -- */

//routes
require("./routes/auth")(app, upload);
require("./routes/conversation")(app);
require("./routes/friendship")(app);
/* -- */

//bu logic temel olarak productionda çalışan express serverimizin cevap olarak client serverimizi (react app) tanıması ve cevap gönderebilmesi için.
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  //Express main.js ve main.css gibi dosyalara ulaşıp cevap verebilsin diye.
  app.use(express.static(path.join(__dirname, "/client/build")));

  //Express gelen route'u tanımazsa index.html sayfasını cevap olarak göndersin diye.

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5000;
http.listen(PORT);
