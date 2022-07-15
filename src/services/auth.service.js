const httpStatus = require('http-status');
const User = require('../models/User');
const userService = require('./user.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with user_id
 * @param {string} user_id
 * @returns {Promise<User>}
 */
const loginWithToken = async (data) => {
    const user = await User.findOne({ user_id: data.user_name });
    const imageSize = 'medium';
    // Update User
    if (user) {
        let update = {
            first_name: data.first_name ? data.first_name : null,
            last_name: data.last_name ? data.last_name : null,
            email: data.email ? data.email : null,
            phone: data.phone_number ? data.phone_number : null,
            image: data.picture_folder && data.picture_file_name ? data.picture_folder + `/${imageSize}/` + data.picture_file_name : null
        };
        const _user = await userService.updateUser(data.user_name, update)
        return _user
    }
    // Create User
    else {
        const newUser = await userService.createUser({
            user_id: data.user_name ? data.user_name : null,
            first_name: data.first_name ? data.first_name : null,
            last_name: data.last_name ? data.last_name : null,
            email: data.email ? data.email : null,
            phone: data.phone_number ? data.phone_number : null,
            image: data.picture_folder && data.picture_file_name ? data.picture_folder + `/${imageSize}/` + data.picture_file_name : null
        });
        return newUser;
    }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

module.exports = {
    loginWithToken,
    refreshAuth
};

