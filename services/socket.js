//run when client connects

module.exports = (io) => {
var connectedUsers = {}; 
io.on("connection", async (socket) => {

  socket.on("notification", async (user) => { 
    connectedUsers[user.userId] = socket;
    socket.broadcast.emit("onlineAlert", user);
  });
  //chat
  socket.on("sendMessage", async (message) => {
   if(connectedUsers[message.to]){
    connectedUsers[message.to].emit("getMessage", (message));
   }
  });
  socket.on("deleteConversation", async (details) => {
    if(connectedUsers[details.friendId]){
    connectedUsers[details.friendId].emit("deleteConversation", (details.userId));
    }
  });
  //friendship 
  socket.on("newFriendRequest", async (friendId) => {
    if(connectedUsers[friendId]){
      connectedUsers[friendId].emit("newFriend", (friendId));
     }
  });
  socket.on("acceptRequest", async (details)=> {
    if(connectedUsers[details.friendId]){
      connectedUsers[details.friendId].emit("requestAccepted", (details.username));
     } 
  });
  socket.on("rejectRequest", async (details)=> {
    if(connectedUsers[details.friendId]){
      connectedUsers[details.friendId].emit("requestRejected", (details.username));
    } 
  });
  socket.on("deleteFriend", async (detail)=> {
    if(connectedUsers[detail.friendId]){
      connectedUsers[detail.friendId].emit("deleteFriend", detail.userId);
    }   
  });
  //run when client disconnect
  socket.on("disconnect", async () => {
    console.log("a user is offline!");
  })
})
}