// const Joi = require('joi');
const { check } = require('express-validator');

// exports.login = {
//     body: Joi.object().keys({
//         access_token: Joi.string().required(),
//         token: Joi.string().required()
//     })
// };

exports.login = [
    check('access_token').not().isEmpty().withMessage("Access token is required!"),
    check('token').not().isEmpty().withMessage("Token is required!"),
]

exports.refresh = [
    check('refresh_token').not().isEmpty().withMessage("Refresh token is required!"),
]
