const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, max: 255 },
    last_name: { type: String, max: 255 },
    user_name: { type: String, max: 255 },
    email: { type: String, unique: true },
    phone: { type: String, max: 150 },
    password: { type: String, max: 255 },
    type: { type: Number, default: 1 },
    image: { type: String },
    is_active: { type: Boolean, default: true },
    last_active: { type: Date() },
    token: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
