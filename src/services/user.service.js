const httpStatus = require('http-status');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isUserTaken(userBody.user_id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already taken');
    }
    return User.create(userBody);
};

module.exports = {
    createUser
};
