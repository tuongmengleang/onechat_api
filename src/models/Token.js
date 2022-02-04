const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true, index: true },
    expires: { type: Date, required: true },
}, { timestamps: true });

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;

