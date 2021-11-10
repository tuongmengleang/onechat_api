const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    name: { type: String, max: 255 },
    image: { type: String, max: 255 },
    is_room: { type: Boolean, default: false },
    participants: { type: Array }
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
