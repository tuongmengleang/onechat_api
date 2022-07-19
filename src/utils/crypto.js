const CryptoJS = require("crypto-js");
const config = require('../config/config');

exports.encrypt = (message) => {
        const cipher = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(config.crypto.key), {
                iv: CryptoJS.enc.Utf8.parse(config.crypto.iv),
                mode: CryptoJS.mode.CBC
        })

        return cipher.toString()
};

exports.decrypt = (secretText) => {
        const cipher = CryptoJS.AES.decrypt(secretText, CryptoJS.enc.Utf8.parse(config.crypto.key), {
                iv: CryptoJS.enc.Utf8.parse(config.crypto.iv),
                mode: CryptoJS.mode.CBC
        })

        return CryptoJS.enc.Utf8.stringify(cipher).toString()
};
