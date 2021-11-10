const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: { type: String, max: 255 },
    conversationId: { type: String },
    text: { type: String, max: 100000 },
    files: { type: Array },
    link: { type: String, max: 500 },
    unread: { type: Boolean }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);

