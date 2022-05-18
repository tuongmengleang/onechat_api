const User = require('../models/User');
const userService = require('./user.service');

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

module.exports = {
    loginWithToken
};

