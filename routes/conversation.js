const mongoose = require("mongoose");
const _ = require("lodash");

const Conversation = mongoose.model("conversations");
const Message = mongoose.model("messages");
const passport = require("passport");
const checkJWT = passport.authenticate("jwt", { session: false });

module.exports = (app) => {
  //MESSAGES

  //get messages with a user
  app.post("/api/messages/get", checkJWT, async (req, res) => {
    const friendId = req.body.friendId;
    const userId = req.user._id;
    const { size, page } = req.query;
    const totalItems = await Message.countDocuments({ _id: req.user._id });

    Message.find({
      $or: [
        { to: friendId, from: userId },
        { to: userId, from: friendId },
      ],
    })
      .sort({ dateSent: "asc" })
      .skip(parseInt(size) * parseInt(page))
      .limit(parseInt(size)) //for budget
      .then((result) => {
        if (!result) {
          return res.status(404).send();
        } else {
          return res.send({
            result,
            pagination: {
              totalItems: totalItems,
              size: size,
              page: page,
              totalPage: Math.ceil(totalItems / size),
            },
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500);
      });
  });

  //post a message
  app.post("/api/message/new", checkJWT, async (req, res) => {
    const from = req.body.from;
    const to = req.body.to;
    const body = req.body.body;

    if (from == to) {
      return res.status(403).send({ error: "You cant send message to yourself!" });
    }

    const message = new Message({
      from,
      to,
      body,
      dateSent: new Date().toISOString(),
    });

    //check if there is a conversation with these messages and check users friendship.. if exist update last message, if not create one
    try {
      const existingFriend = await User.find({ $and: [{ _id: from }, { friends: to }] });

      if (_.isEmpty(existingFriend)) {
        return res.status(400).json({ sendError: "You are not friends with that user!" });
      }

      const existingConversation = await Conversation.findOneAndUpdate(
        // {$or:[{recipients: [from,to]},{recipients: [to,from]}]},  // another slower way
        { recipients: { $all: [from, to] } },
        {
          lastMessage: { dateSent: new Date().toISOString(), body: body },
        },
        { new: true }
      );

      if (!existingConversation) {
        const conversation = new Conversation({
          recipients: [mongoose.Types.ObjectId(from), mongoose.Types.ObjectId(to)],
          createdAt: new Date().toISOString(),
          lastMessage: { body: body, dateSent: new Date().toISOString() },
        });
        conversation.save();
      }
    } catch (err) {
      console.error(err);
    }

    await message.save();
    res.send(message);
  });

  //delete all messages (for dev)
  app.get("/api/messages/delete", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      res.status(401).send({ error: "Cant delete on production" });
    } else {
      await Message.deleteMany({});
      res.send({ message: "DELETED" });
    }
  });

  //CONVERSATIONS

  //get all conversations user's owned or being recipient
  app.get("/api/conversations/all", checkJWT, async (req, res) => {
    const user = req.user;

    const conversations = await Conversation.aggregate([
      {
        $match: { recipients: { $elemMatch: { $in: [user._id] } } },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipients",
          foreignField: "_id",
          as: "recipients_info",
        },
      },
      {
        $unwind: "$recipients_info",
      },
      {
        $match: {
          "recipients_info._id": {
            $ne: user._id,
          },
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          lastMessage: 1,
          recipients_info: {
            _id: "$recipients_info._id",
            name: "$recipients_info.name",
            pictureUrl: "$recipients_info.pictureUrl",
          },
        },
      },
      {
        $sort: {
          "lastMessage.dateSent": -1,
        },
      },
    ]);

    if (!conversations) {
      res.status(404).send({ error: "Sahip olduğunuz veya içinde bulunduğunuz bir konuşma yok!" });
    } else {
      res.send(conversations);
    }
  });

  //create a conversation
  app.post("/api/conversation/create", checkJWT, async (req, res) => {
    const userId = req.user._id;
    const friendId = req.body.friendId;
    const lastMessage = req.body.lastMessage;

    const existingConv = await Conversation.findOne({
      $or: [{ recipients: [friendId, userId] }, { recipients: [userId, friendId] }],
    });
    if (existingConv) {
      return res.status(400).send(existingConv._id);
    }

    const conversation = new Conversation({
      recipients: [mongoose.Types.ObjectId(userId), mongoose.Types.ObjectId(friendId)],
      createdAt: new Date().toISOString(),
      lastMessage: { body: lastMessage.body, dateSent: lastMessage.dateSent },
    });

    await conversation.save();
    return res.send(conversation);
  });

  //delete a conservation
  app.post("/api/conversation/delete", checkJWT, async (req, res) => {
    const userId = req.user._id;
    const friendId = req.body.friendId;

    Conversation.findOneAndDelete({ $and: [{ recipients: friendId }, { recipients: userId }] })
      .then((result) => {
        if (!result) {
          return res.status(404).send({ error: "There is no conversation with these details" });
        }
        //delete messages
        Message.deleteMany({
          $or: [
            { from: userId, to: friendId },
            { from: friendId, to: userId },
          ],
        })
          .then(() => {
            return res
              .status(200)
              .send({ message: "Conversation and messages deleted succesfully" });
          })
          .catch((err) => {
            console.error(err);
            return res.status(500);
          });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500);
      });
  });
};
