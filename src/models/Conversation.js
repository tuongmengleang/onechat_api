const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    name: { type: String, max: 255 },
    image: { type: String, max: 255 },
    participants: { type: Array },
    creator: { type: String },
    delete_by: { type: Array }
}, { timestamps: true });

module.exports = mongoose.model("Conversations", ConversationSchema);
