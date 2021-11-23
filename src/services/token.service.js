const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const Token = require('../models/Token');
const ApiError=  require('../utils/ApiError');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};


/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, blacklisted = false) => {
    const tokenDocs = await Token.create({
        token,
        userId: userId,
        expires: expires.toDate(),
        blacklisted,
    });
    return tokenDocs;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
exports.generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user._id, accessTokenExpires, 'access');

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user._id, refreshTokenExpires, 'refresh');

    await saveToken(refreshToken, user._id, refreshTokenExpires);
    return { token: accessToken, expires: accessTokenExpires.toDate() };
    // return {
    //     access: {
    //         token: accessToken,
    //         expires: accessTokenExpires.toDate(),
    //     },
    //     refresh: {
    //         token: refreshToken,
    //         expires: refreshTokenExpires.toDate(),
    //     },
    // };
};
