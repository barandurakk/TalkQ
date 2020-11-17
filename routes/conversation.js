const passport = require("passport");
const mongoose = require("mongoose");
const _ = require("lodash");
const requireLogin = require("../middlewares/requireLogin");
const dayjs = require("dayjs")

const User = mongoose.model("users");
const Conversation = mongoose.model("conversations");
const Message = mongoose.model("messages");

module.exports = (app) => {

  //MESSAGES

  //get messages by user
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

  //post a message
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
    const conversations = await Conversation.find({
      $or: [{ owner: user._id, recipients: user._id }],
    });
    if (!conversations) {
      res.status(404).send({ error: "Sahip olduğunuz veya içinde bulunduğunuz bir konuşma yok!" });
    } else {
      res.send(conversations);
    }
  });

  //create a conversation
  app.post("/api/conversation/create", requireLogin, async (req, res) => {
    const user = req.user;
    console.log(req.body);
    const { recipients } = req.body;

    const existingConv = await Conversation.findOne({recipients: recipients});
    if(existingConv){
      return res.status(400).send(existingConv._id);
    }

    const conversation = new Conversation({
      recipients,
      createdAt: Date.now(),
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
