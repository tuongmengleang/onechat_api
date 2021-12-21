// const httpStatus = require('http-status');
const Message = require('../models/Message');

/**
 * Update message by id
 * @param {ObjectId} id
 * @returns {Promise<Messages>}
 */
const updateMessageReadUnread = async (_id, is_read) => {
    // await Message.update({ _id: _id }, { $addToSet: {read_by: [user_id], $set: { is_read: is_read }} }, { multi: true })
    await Message.update({ _id: _id }, { $set: { is_read: is_read } }, { multi: true })
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

module.exports = {
    updateMessageReadUnread,
    latestMessage,
};
