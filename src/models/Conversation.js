const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const conversationSchema = new mongoose.Schema({
    name: { type: String, max: 255 },
    image: { type: String, max: 255 },
    participants: [{ type: ObjectId, ref: "User" }] ,
    is_group: { type: Boolean, default: false },
    creator: { type: ObjectId, ref: "User" },
    delete_by: { type: Array },
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
