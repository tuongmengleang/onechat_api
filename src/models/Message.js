const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ObjectId = mongoose.Schema.ObjectId;

const messageSchema = new mongoose.Schema({
    conversation_id: { type: ObjectId, ref: "Conversation" },
    author: { type: String },
    text: { type: String, max: 1000000 },
    files: [{
        src: String,
        name: String,
        extension: String,
        size: Number,
        category: String
    }],
    // is_compression: { type: Number, default: 1 },
    link: { type: String, max: 500 },
    delete_by: { type: Array },
    read_by: { type: Array },
    is_read: { type: Boolean, default: false },
    type: { type: Number, default: 0 }
    // type (0 = text), (1 = medias [images*, videos&, gif]), (2 = docs), (4 = voice), (5 = link)
}, { timestamps: true });

messageSchema.plugin(mongoosePaginate);
messageSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Message", messageSchema);

