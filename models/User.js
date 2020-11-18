const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  pictureUrl: { type: String },
  role: { type: String, default: "User" },
  dateRegister: { type: Date, default: Date.now() },
  friends : [mongoose.Schema.ObjectId],
  isOnline: {type:Boolean, default:false, required: true},
});

mongoose.model("users", userSchema);
