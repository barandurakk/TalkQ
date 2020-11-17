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
var connectedUsers = {}; 
const User = mongoose.model("users")
io.on("connection", async (socket) => {


  socket.on("notification", async (user) => { 

    connectedUsers[user.userId] = socket;
    socket.broadcast.emit("onlineAlert", user);

    // User.findByIdAndUpdate({_id:user.userId},{isOnline:true, socketId: socket.id}).then(()=> {
    //   socket.broadcast.emit("onlineAlert", user);
    // }).catch(err => {
    //   console.error(err);
    // })
  });

  //chat

 socket.on("sendMessage", async (message) => {
   
    connectedUsers[message.to].emit("getMessage", (message));
   
});

  //friendship 
  socket.on("newFriendRequest", async (friendId) => {
    User.findOne({_id:friendId},{socketId:1}).then((res) =>{
      io.to(res.socketId).emit("newFriend", (friendId));
    }).catch(err => {
      console.error(err);
    })
  });

  socket.on("acceptRequest", async (details)=> {
    User.findOne({_id:details.friendId},{socketId:1}).then(res => {
      io.to(res.socketId).emit("requestAccepted", (details.username));
    }).catch(err => {
      console.error(err);
    })
    
  });

  socket.on("rejectRequest", async (details)=> {
    User.findOne({_id:details.friendId},{socketId:1}).then(res => {
      io.to(res.socketId).emit("requestRejected", (details.username));
    }).catch(err => {
      console.error(err);
    })
    
  });

  socket.on("deleteFriend", async (friendId)=> {
    User.findOne({_id:friendId},{socketId:1}).then(res => {
      io.to(res.socketId).emit("deleteFriend");
    }).catch(err => {
      console.error(err);
    })
    
  });

  //run when client disconnect
  socket.on("disconnect", async () => {
    console.log("a user is offline!");
    await User.findOneAndUpdate({socketId: socket.id}, {isOnline: false, socketId:null});
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
