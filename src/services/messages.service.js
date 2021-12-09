// const httpStatus = require('http-status');
const Message = require('../models/Message');

/**
 * Update message by id
 * @param {ObjectId} id
 * @returns {Promise<Messages>}
 */
const updateMessageReadBy = async (_id, user_id) => {
    await Message.update({ _id: _id }, { $addToSet: {read_by: [user_id]} }, { multi: true })
};

/**
 * Get latest message of conversation
 * @param {ObjectId} conversation_id
 * @returns {Promise<Messages>}
 */
const latestMessage = async (conversation_id) => {
    const latestMessage = await Message.aggregate([
        { $match: { conversation_id: conversation_id } },
        { $sort: { 'createdAt': -1 } },
        { $limit: 1 },
    ]);

    return latestMessage;
};

const getUnread = async (conversation_id) => {
    // const messages = await Message.aggregate([
    //     { $match: { conversation_id: conversation_id } }
    // ]);
    // const message = await Message.find({read_by: 'user#83'});
    const message = await Message.find({_id: '61b07b0483ae40cbafd23a3a'}, {read_by: 1})
    return message
};

module.exports = {
    updateMessageReadBy,
    latestMessage,
    getUnread
};
