const Joi = require('joi');


exports.login = {
    body: Joi.object().keys({
        access_token: Joi.string().required(),
        token: Joi.string().required()
    })
};
