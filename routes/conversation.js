const passport = require("passport");
const mongoose = require("mongoose");
const _ = require("lodash");
const requireLogin = require("../middlewares/requireLogin");
const dayjs = require("dayjs");

const User = mongoose.model("users");
const Conversation = mongoose.model("conversations");
const Message = mongoose.model("messages");

module.exports = (app) => {

  //MESSAGES

  //get messages with a user
  app.post("/api/messages/get", requireLogin, async (req,res) => {

    const friendId = req.body.friendId;
    const userId= req.user._id;
    

    Message.find({$or:[{to: friendId, from:userId}, {to: userId, from:friendId}]}).sort({dateSent: "asc"})
    .then(result => {
    
      if(!result){
        return res.status(404).send();
      }else{
        return res.send(result);
      }
    }).catch(err => {
      console.error(err);
      return res.status(500);
    })

  })

  //post a message  (if no friend cant send!--will be added)
  app.post("/api/message/new", requireLogin, async (req,res) => {
      const from = req.body.from;
      const to = req.body.to;
      const body = req.body.body;

      if(from == to){
        return res.status(403).send({error: "You cant send message to yourself!"})
      }

      const message = new Message ({
          from,
          to,
          body,
          dateSent: new Date().toISOString(),
      })


      //check if there is a conversation with these messages.. if exist update last message, if not create one
      try{
        const existingConversation = await Conversation.findOneAndUpdate(
         // {$or:[{recipients: [from,to]},{recipients: [to,from]}]},  // another slower way
         { recipients: { $all: [ from, to ] } },
          {
            lastMessage: {dateSent: new Date().toISOString(), body: body}
          },{new: true})

          if(!existingConversation){
            const conversation = new Conversation ({
              recipients: [ mongoose.Types.ObjectId(from), mongoose.Types.ObjectId(to)],
              createdAt: new Date().toISOString(),
              lastMessage: {body: body, dateSent: new Date().toISOString()}
          })
          conversation.save();
          }

      }catch(err){
        console.error(err);
      }
      

      await message.save();
      res.send(message);
  })

  //delete all messages (for dev)
  app.get("/api/messages/delete", async (req,res) => {
    await Message.deleteMany({});
    res.send({message: "DELETED"});
  })



  //CONVERSATIONS

  //get all conversations user's owned or being recipient
  app.get("/api/conversations/all", requireLogin, async (req, res) => {
    const user = req.user;

    const conversations = await Conversation.aggregate([
      {
       $match: {recipients: {$elemMatch: {$in:[user._id]}}}
      },
      {
        $lookup:
        {
          from: "users",
          localField: "recipients",
          foreignField: "_id",
          as: "recipients_info"
        }
      },
      {
        $unwind: "$recipients_info"
      },  
      {
        $match: {"recipients_info._id": {
                  "$ne":user._id
                }
      }
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          lastMessage: 1,
          recipients_info:{
            _id: "$recipients_info._id",
            name: "$recipients_info.name",
            pictureUrl: "$recipients_info.pictureUrl",
          }
        }
      },
      {
        $sort: {
          "lastMessage.dateSent": -1
        }
      }
    ])

    if (!conversations) {
      res.status(404).send({ error: "Sahip olduğunuz veya içinde bulunduğunuz bir konuşma yok!" });
    } else {
      
      res.send(conversations);
    }
  });

  //create a conversation
  app.post("/api/conversation/create", requireLogin, async (req, res) => {
    const userId = req.user._id;
    const friendId = req.body.friendId;
    const lastMessage = req.body.lastMessage;

    const existingConv = await Conversation.findOne({ $or:[{recipients: [friendId, userId]},{recipients: [userId, friendId]}]});
    if(existingConv){
      return res.status(400).send(existingConv._id);
    }

    const conversation = new Conversation({
      recipients: [ mongoose.Types.ObjectId(userId), mongoose.Types.ObjectId(friendId)],
      createdAt: new Date().toISOString(),
      lastMessage: {body: lastMessage.body, dateSent:lastMessage.dateSent }
    });

    await conversation.save();
    return res.send(conversation);
  });

  //delete a conservation
  app.get("/api/conversation/:conversationId/delete", requireLogin, async (req, res) => {
    const user = req.user;
    const convId = req.params.conversationId;

    Conversation.find({ _id: convId })
      .then((conversation) => {
        if (_.isEmpty(conversation)) {
          res.status(404).send({ error: "Böyle bir konuşma bulunamadı!" });
        } else if (user.id !== conversation[0].owner.toString()) {
          console.log(conversation[0].owner);
          console.log(user.id);
          res.status(401).send({ error: "Bu konuşma sizin değil!" });
        } else {
          Conversation.findByIdAndDelete({ _id: convId })
            .then((result) => {
              if (result) res.send({ message: "Konuşma başarıyla silindi" });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        res.send(404).send({ error: "Konuşmaya ulaşamadık :(" });
      });
  });
};
