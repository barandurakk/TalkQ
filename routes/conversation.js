const passport = require("passport");
const mongoose = require("mongoose");
const _ = require("lodash");
const requireLogin = require("../middlewares/requireLogin");

const User = mongoose.model("users");
const Conversation = mongoose.model("conversations");
const Message = mongoose.model("messages");

module.exports = (app) => {
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

    const conversation = new Conversation({
      recipients,
      owner: req.user.id,
      createdAt: Date.now(),
    });

    await conversation.save();
    res.send(conversation);
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
