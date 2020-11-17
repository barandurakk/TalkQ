const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "conservations",
  },
  to: {
    type: Schema.Types.ObjectId,
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true,
  },
  dateSent: {
    type: String,
    default: Date.now(),
  }
});

mongoose.model("messages", messageSchema);
