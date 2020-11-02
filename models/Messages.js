const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "conservations",
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  body: {
    type: String,
    required: true,
  },
  dateSent: {
    type: String,
    default: Date.now(),
  },
  user_avatar: {
    type:String,
    required: false
  }
});

mongoose.model("messages", messageSchema);
