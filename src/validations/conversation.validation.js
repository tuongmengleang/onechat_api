const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createConversation = {
    body: Joi.object().keys({
        creator: Joi.string().required().label("Creator is required!"),
        participants: Joi.array().required().label("Participants is required!")
    })
};

const updateConversation = {
    params: Joi.object().keys({
        conversation_id: Joi.required().custom(objectId)
    }),
    body: Joi.object().keys({
        name: Joi.string(),
        creator: Joi.string().custom(objectId),
        participants: Joi.array()
    }).min(1),
};

module.exports = {
    createConversation,
    updateConversation
};
