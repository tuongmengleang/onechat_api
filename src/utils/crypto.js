const CryptoJS = require("crypto-js");
const config = require('../config/config')
exports.decrypt = (secretText) => {
    return CryptoJS.AES.decrypt(secretText, config.crypto_secret_key).toString(CryptoJS.enc.Utf8);
};

