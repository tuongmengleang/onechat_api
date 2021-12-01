// const httpStatus = require('http-status');
const Message = require('../models/Message');

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
    latestMessage
};
