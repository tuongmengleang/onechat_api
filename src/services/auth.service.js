const httpStatus = require('http-status');
const User = require('../models/User');
const userService = require('./user.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with user_id
 * @returns {Promise<User>}
 * @param data
 */
const loginWithToken = async (data) => {
  const user = await User.findOne({ user_id: data.username });
  // Update User
  if (user) {
    let update = {
      first_name: data.first_name ? data.first_name : null,
      last_name: data.last_name ? data.last_name : null,
      email: data.email ? data.email : null,
      image: data?.current_employee?.file_info?.file_url,
    };
    return await userService.updateUser(data.username, update);
  }
  // Create User
  else {
    return await userService.createUser({
      user_id: data.username ?? null,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      email: data.email ?? null,
      image: data?.current_employee?.file_info?.file_url,
    });
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
  refreshAuth,
};
