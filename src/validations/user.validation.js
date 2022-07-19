const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
    }),
};

const updateUser = {
    // params: Joi.object().keys({
    //     userId: Joi.required().custom(objectId),
    // }),
    body: Joi.object()
        .keys({
            first_name: Joi.string(),
            last_name: Joi.string(),
            device_token: Joi.string()
        })
        .min(1),
};

module.exports = {
    getUser,
    getUsers,
    updateUser
};
