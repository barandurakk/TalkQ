const express = require("express");
const mongoose = require("mongoose");
const keys = require("./util/keys");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer( app );
const socketIo = require("socket.io");
const multer = require("multer");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const fileUploader = require("./services/fileUploader");

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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

//uploadAvatar (cloudinary/multer)
app.post("/api/upload", multerMid.single("avatar"), fileUploader);
/* -- */

//socket io
const io = socketIo(http, {wsEngine: "ws"});

//run when client connects
const User = mongoose.model("users")
io.on("connection", async (socket) => {
  console.log("client is: ", socket.id);


  socket.on("notification", async (user) => {
    socket.broadcast.emit("onlineAlert", user);
    await User.findByIdAndUpdate({_id:user.userId},{isOnline:true, socketId: socket.id});
  });

  socket.on("newFriendRequest", async (friendId) => {
    const friendSocketId = await User.findOne({_id:friendId},{socketId:1});
    io.to(friendSocketId.socketId).emit("newFriend", (friendId));
  });

  socket.on("acceptRequest", async (details)=> {
    const friendSocketId = await User.findOne({_id:details.friendId},{socketId:1});
    io.to(friendSocketId.socketId).emit("requestAccepted", (details.username));
  });

  //run when client disconnect
  socket.on("disconnect", () => {
    console.log("a user is offline!");
    User.findOneAndUpdate({socketId: socket.id}, {isOnline: false, socketId:null});
  })
})

/* -- */

//routes
require("./routes/auth")(app);
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
