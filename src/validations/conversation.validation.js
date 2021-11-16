const Joi = require('joi');

const conversation = {
    body: Joi.object().keys({
        creator: Joi.string().required(),
        participants: Joi.array().required()
    })
};

module.exports = conversation;
