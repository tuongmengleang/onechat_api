const CryptoJS = require("crypto-js");
const config = require('../config/config');
const key = "leang"
exports.decrypt = (word) => {
    // return CryptoJS.HmacSHA1(word, key);
    var bytes  = CryptoJS.AES.decrypt(word, key).toString(CryptoJS.enc.Utf8);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return bytes
};
