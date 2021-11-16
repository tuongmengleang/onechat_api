const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversation_id: { type: String },
    author: { type: String },
    text: { type: String, max: 1000000 },
    files: { type: Array },
    link: { type: String, max: 500 },
    delete_by: { type: Array }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);

