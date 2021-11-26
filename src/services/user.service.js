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
    return await User.create(userBody);
};

/**
 * Get all users
 * @returns {Promise<Users>}
 */
const queryUsers = async() => {
    const users = await User.find({});

    return users
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return User.findById(id);
};

module.exports = {
    createUser,
    queryUsers,
    getUserById
};
