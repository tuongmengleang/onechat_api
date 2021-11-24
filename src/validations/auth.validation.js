const Joi = require('joi');
// const { password } = require('./custom.validation');


exports.signin = {
    body: Joi.object().keys({
        access_token: Joi.string().required(),
        token: Joi.string().required()
    })
};
