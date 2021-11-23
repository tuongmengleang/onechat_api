const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true, index: true },
    expires: { type: Date, required: true },
    blacklisted: { type: Boolean, default: false }
}, { timestamps: true });

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;

