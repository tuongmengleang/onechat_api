const httpStatus = require('http-status');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

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
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (name) => {
    if (name) {
        // const users = await User.find({
        //     "$expr": {
        //         "$regexMatch": {
        //             "input": { "$concat": ["$first_name", " ", "$last_name"] },
        //             "regex": name   ,  //Your text search here
        //             "options": "i"
        //         }
        //     }
        // })
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
 * Update user status active (online)
 * @param {ObjectId} _id
 * @param {Boolean} is_active
 * @returns {Promise<User>}
 */
const updateUserStatus = async (_id, is_active) => {
    await User.findByIdAndUpdate(_id, { is_active: is_active, last_active: Date.now() });
    global.io.emit('update-user-online', _id);
};

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    updateUserStatus
};
