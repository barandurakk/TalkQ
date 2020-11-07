const mongoose = require("mongoose");
const { Schema } = mongoose;

const  FriendRequestSchema = new Schema({
    requester: {
        type: String,
        required: true
    },
    requesterName: {
        type: String
    },
    recipient: {
        type: String,
        required: true
    },
    requesterAvatar: {
        type: String
    },
    // 1. pending  2.accepted  3.rejected
    status: {
        type: Number,
        required: true }});


mongoose.model("friendRequest",  FriendRequestSchema);
