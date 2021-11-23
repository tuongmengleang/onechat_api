const User = require('../models/User');
const userService = require('./user.service');

/**
 * Login with user_id
 * @param {string} user_id
 * @returns {Promise<User>}
 */
const loginWithToken = async (data) => {
    const user = await User.findOne({ user_id: data.id });
    if (!user) {
        const newUser = await userService.createUser({
            user_id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone_number,
            image: 'https://dev-api.uvacancy.com/api/v1/media?path=' + data.picture_folder + '/small/' + data.picture_file_name
        });
        return newUser;
    }
    else return user;
};

module.exports = {
    loginWithToken
};
