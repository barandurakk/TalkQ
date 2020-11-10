const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema({
  lastMessage: { type: String },
  owner: { type: Schema.Types.ObjectId },
  createdAt: { type: String, default: Date.now() },
  recipients: [Schema.Types.ObjectId],
});

mongoose.model("conversations", conversationSchema);
