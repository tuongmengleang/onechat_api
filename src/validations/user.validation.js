const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getUser = {
    params: Joi.object().keys({
        user_id: Joi.string().custom(objectId),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
    }),
};

module.exports = {
    getUser,
    getUsers
};
