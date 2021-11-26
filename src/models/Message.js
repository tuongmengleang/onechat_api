const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MessageSchema = new mongoose.Schema({
    conversation_id: { type: String },
    author: { type: String },
    text: { type: String, max: 1000000 },
    files: { type: Array },
    link: { type: String, max: 500 },
    delete_by: { type: Array },
    read_by: { type: Array }
}, { timestamps: true });

MessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Messages", MessageSchema);

