const _ = require("lodash");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const conversation = require("./conversation");
const FriendRequest = mongoose.model("friendRequest");
const User = mongoose.model("users")

module.exports = (app) => {

    //FRIENDSHIPS

    //fetch all users friends
    app.get("/api/friends", requireLogin, async (req,res) => {

        const userId = req.user._id;

        try{
            const friendList = await User.aggregate([
                {
                    $match: {_id: userId}
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "friends",
                        foreignField: "_id",
                        as: "friends_info"
                    }
                },
                {
                    $unwind: "$friends_info"
                },
                {
                    $project: 
                    {
                        friends_info: {name:"$friends_info.name", pictureUrl: "$friends_info.pictureUrl",  _id: "$friends_info._id"},
                        _id: 0
                    }
                }
            ])

            res.send(friendList);
        }catch(err){
            console.error(err);
            res.status(500);
        }
    })

    //delete a users friends
    app.get("/api/friends/delete/:friendId", requireLogin, (req,res) => {

        const userId= req.user._id;
        const friendId = req.params.friendId;

            if(userId == friendId){
               return res.status(400).send({deleteError: "You can't delete yourself in friendship"})
            }

            //find user and delete friend by id
            User.findByIdAndUpdate({_id: userId},{
                $pull: {friends: friendId}
            }).then(() => {
                User.findByIdAndUpdate({_id: friendId}, 
                    {
                        $pull: {friends: userId}
                    }).then(() => {
                        return res.status(200).send(friendId);
                    }).catch(err => {
                        console.error(err);
                        return res.status(500).send();
                    }) 
                   
            }).catch(err => {
                console.error(err);
                return res.status(500).send();
            }) 

    })



    //FRIEND REQUESTS
    
    //send a friend request
    app.post("/api/addFriend", requireLogin, async (req,res) => {
        const recipientId = req.body.recipient;
        const requesterId = req.user._id;
        const requesterName = req.user.name;
        const requesterAvatar = req.user.pictureUrl;

        //check if the recipient is you
        if(recipientId == requesterId){
           return res.status(400).json({sendError: "You cannot send friend request to yourself!"})
        }

        //check is there a user by that id
        try{
            const recipient = await User.findOne({_id: recipientId});
            if(!recipient){
                return  res.status(404).json({sendError: "No user find by that Id"});
            }
        }catch(err){
            if(err.kind === "ObjectId"){
                return res.status(400).json({sendError: "User id format is wrong!"});
            }else{
                return  res.status(500).json({sendError: err});
            }
        }
       
        //check if there is a request same as you sended
        try{
            const existingRequest = await  FriendRequest.findOne({ $and: [{ requester: requesterId}, {recipient: recipientId} ]});
            if(existingRequest){
                return  res.status(400).json({sendError: "You already send friend request to this user!"});
            }
        }catch(err) {
            console.error(err);
            return  res.status(500).json({sendError: err});
        }

        //check if you are already friends together
        try{

           const existingFriend = await User.find({ $and:[{_id: requesterId}, {friends: recipientId }] });
          
           if(!_.isEmpty(existingFriend)){
            return  res.status(400).json({sendError: "You already friends with that user!"});
           }

        }catch(err) {
            console.error(err);
            return  res.status(500).json({sendError: err});
        }

        const friendRequest = new FriendRequest({
            requester: requesterId,
            requesterName,
            recipient: recipientId,
            requesterAvatar,
            status: 1 //pending
        })

        try{
            friendRequest.save();
            res.send(friendRequest);
        }catch(err){
            console.error(err);
            return res.status(500).json({sendError: err});
        }

    })

    //get owned friendRequests
    app.get("/api/getFriendRequest", requireLogin, async (req,res) => {

        const userId = req.user._id;

        try {
            const friendRequests = await FriendRequest.find({ $and: [{ recipient: userId}, {status: 1} ]});
            if(_.isEmpty(friendRequests)){
              return res.status(404);
            }else{ 
              return  res.send(friendRequests);
            } 
        }catch(err){
            console.error(err);
            return res.status(500).send({getNotificationError: err});
        }  

    })

    //accept friend request
    app.get("/api/acceptFriend/:requestId", requireLogin, async (req,res)=> {

        const requestId = req.params.requestId;
        const userId = req.user._id;
       
            
        FriendRequest.findOneAndDelete({_id: requestId, recipient: userId, status:1 }
            )
            .then(result => {

                    console.log("result: ", result);
                    if(!result){
                        return res.status(404).send({error: "Can't found request!"});
                    }

                        //add friend list
                        User.findOneAndUpdate({_id: userId, friends: {$exists: true, $nin: [result.requester]}}, 
                            {
                                $push: {
                                    friends: result.requester
                                }
                            }).then(() => {
                                User.findOneAndUpdate({_id: result.requester, friends: {$exists: true, $nin: [userId]}}, 
                                    {
                                        $push: {
                                            friends: userId
                                        }
                                    }).then(()=> {
                                        return res.status(200).send(requestId);
                                    }).catch(err => {
                                        console.error(err);
                                        return res.status(500).send({error: err});
                                    })

                            }).catch(err => {
                                console.error(err);
                                return res.status(500).send({error: err});
                            })
            }).catch(err => {
                console.error(err);
                return res.status(500).send({error: err});
            })
                
    })

    //reject friends request
    app.get("/api/rejectFriend/:requestId", requireLogin, async (req,res)=> {

        const requestId = req.params.requestId;
        const userId = req.user._id;

        try {
            //look for request and change status to rejected and delete
            const friendRequest = await FriendRequest.findOneAndDelete({_id: requestId, recipient: userId, status:1 });
           
            if(_.isEmpty(friendRequest)){
              return res.status(404).send({error: "Can't found request!"});
            }
            
            res.send(friendRequest);
        }catch(err){
            console.error(err);
            return res.status(500).send({error: err});
        }  

    })

};
