const mongoose = require('mongoose');
const { tokenTypes } = require('../config/tokens');

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, ref: 'User'
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [tokenTypes.REFRESH],
        required: true,
    },
    expires: {
        type: Date,
        required: true
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;

