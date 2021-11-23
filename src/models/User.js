const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const Token = require('./Token');

const UserSchema = new mongoose.Schema({
    user_id: { type: String, unique: true },
    first_name: { type: String, max: 255 },
    last_name: { type: String, max: 255 },
    email: { type: String, unique: true },
    phone: { type: String, max: 150 },
    password: { type: String, max: 255 },
    type: { type: Number, default: 1 },
    image: { type: String },
    is_active: { type: Boolean, default: true },
    last_active: { type: Date },
}, { timestamps: true });

// Virtual for user's full name
UserSchema.virtual('full_name')
    .get(() => {
        return this.first_name + ' ' + this.last_name;
    });

/**
 * Check if email is taken
 * @param {string} user_id - The user's id
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserSchema.statics.isUserTaken = async function (user_id, excludeUserId) {
    const user = await this.findOne({ user_id, _id: { $ne: excludeUserId } });
    return !!user;
};


module.exports = mongoose.model("Users", UserSchema);
