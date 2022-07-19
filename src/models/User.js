const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// const Token = require('./Token');

const userSchema = new mongoose.Schema({
    user_id: { type: String, unique: true },
    first_name: { type: String, required: true, max: 255 },
    last_name: { type: String, required: true, max: 255 },
    email: { type: String },
    phone: { type: String, max: 150 },
    password: { type: String, max: 255 },
    type: { type: Number, default: 1 },
    image: { type: String },
    is_active: { type: Boolean, default: false },
    last_active: { type: Date },
    last_login: { type: Date, default: Date.now() },
    device_token: { type: String, default: '' }
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } },{ timestamps: true });

// Virtual for user's full name
userSchema.virtual('full_name').get(function () {
    return [this.first_name, this.last_name].filter(Boolean).join(' ');
});

/**
 * Check if email is taken
 * @param {string} user_id - The user's id
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUserTaken = async function (user_id, excludeUserId) {
    const user = await this.findOne({ user_id, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.generateAuthToken = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        user_id: this.user_id,
        first_name: this.first_name,
        last_name: this.last_name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

module.exports = mongoose.model("User", userSchema);
