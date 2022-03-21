const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
    body: Joi.object().keys({
        conversation_id: Joi.required().custom(objectId),
        author: Joi.required().custom(objectId),
        text: Joi.string(),
        is_group: Joi.bool(),
        loading_id: Joi.string()
    })
};

const sendInMessage = {
    params: Joi.object().keys({
        userId: Joi.string().required()
    }),
    body: Joi.object().keys({
        author: Joi.string().required(),
        text: Joi.string(),
        link: Joi.string()
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
    sendInMessage,
    getMessage,
    pushNotification
};
