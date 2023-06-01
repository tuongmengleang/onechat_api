// const Joi = require('joi');
const { check } = require('express-validator');

// exports.login = {
//     body: Joi.object().keys({
//         access_token: Joi.string().required(),
//         token: Joi.string().required()
//     })
// };

const login = [
    // check('access_token').not().isEmpty().withMessage("Access token is required!"),
    check('token').not().isEmpty().withMessage("Token is required!"),
]

const loginUsernamePasword = [
    check('username').not().isEmpty().withMessage("Username is required!"),
    check('password').not().isEmpty().withMessage("Password is required!"),
]

const refresh = [
    check('refresh_token').not().isEmpty().withMessage("Refresh token is required!"),
]

module.exports = {
    login,
    loginUsernamePasword,
    refresh
};
