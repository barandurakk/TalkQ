const mongoose = require("mongoose");
const { Schema } = mongoose;
const {userSchema} = require("./User");

const conversationSchema = new Schema({
  lastMessage: { type: Object },
  owner: { type: Schema.Types.ObjectId },
  createdAt: { type: String, default: Date.now() },
  recipients: [{type: Schema.Types.ObjectId, ref:"users"}],
});

mongoose.model("conversations", conversationSchema);
