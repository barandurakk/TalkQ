const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema({
  lastMessage: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "users" },
  createdAt: { type: String, default: Date.now() },
  recipients: [{ type: Schema.Types.ObjectId, ref: "users" }],
});

mongoose.model("conversations", conversationSchema);
