const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
    body: Joi.object().keys({
        conversation_id: Joi.required().custom(objectId),
        author: Joi.required().custom(objectId),
        text: Joi.string().required()
    })
};

const getMessage = {
    params: Joi.object().keys({
        conversation_id: Joi.required().custom(objectId)
    })
};

const pushNotification = {
    body: Joi.object().keys({
        registrationToken: Joi.string().required(),
        text: Joi.string().required()
    })
};

module.exports = {
    createMessage,
    getMessage,
    pushNotification
};
