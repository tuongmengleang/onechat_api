const Joi = require('joi');
// const { password } = require('./custom.validation');


exports.login = {
    body: Joi.object().keys({
        access_token: Joi.string().required(),
        token: Joi.string().required()
    })
};
