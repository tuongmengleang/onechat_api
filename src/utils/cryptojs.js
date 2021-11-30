const CryptoJS = require("crypto-js");
const config = require('../config/config');

exports.decrypt = (word) => {
    let bytes = CryptoJS.AES.decrypt(word, config.encrypt_secret_key);
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(plaintext);
};
