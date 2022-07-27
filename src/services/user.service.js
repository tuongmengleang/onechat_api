const httpStatus = require('http-status');
const axios = require('axios');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

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
 * Create a user from uvcancy
 * @param {String} user_name
 * @returns {Promise<User>}
 */
const fetchUserFromUvacancy = async (user_name) => {
    const resp = await axios.post(`${config.uvacancy.endpoint_url}/api/v1/get-profile`, {
        user_name: user_name
    })
    return resp.data.data
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (name) => {
    if (name) {
        const users = await User.aggregate(
            [ { $match : { full_name : "Kong" } } ]
        );
        return users;
    }
    else return [];
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
    return User.findById(id);
};

/**
 * Get user by user_id
 * @param {ObjectId} user_id
 * @returns {Promise<User>}
 */
const getUserByUserId = async (user_id) => {
    return User.findOne({user_id});
};

/**
 * Update user status active (online)
 * @param {ObjectId} _id
 * @param {Boolean} is_active
 * @returns {Promise<User>}
 */
const updateUserActive = async (userId, is_active) => {
    const user = await User.findOneAndUpdate({ user_id: userId }, { is_active: is_active, last_active: Date.now() });
    if (user) global.io.emit('active-user', { userId: user._id, status: is_active});
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, payload, callback) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Update user info
 * @param {ObjectId} user_id
 * @returns {Promise<User>}
 */
const updateUser = async (userId, update) => {
    const _user = await User.findOneAndUpdate({ user_id: userId }, update);
    return _user
};


module.exports = {
    createUser,
    fetchUserFromUvacancy,
    queryUsers,
    getUserById,
    getUserByUserId,
    updateUserActive,
    updateUserById,
    updateUser,
};
