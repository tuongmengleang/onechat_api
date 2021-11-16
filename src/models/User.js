const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const Token = require('./Token');

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
    last_active: { type: Date },
    token: { type: String }
}, { timestamps: true });

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    })
};

module.exports = mongoose.model("User", UserSchema);
