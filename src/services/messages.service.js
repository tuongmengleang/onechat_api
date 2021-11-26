const httpStatus = require('http-status');
const Message = require('../models/Message');

/**
 * Get latest message of conversation
 * @param {ObjectId} conversation_id
 * @returns {Promise<Messages>}
 */
const latestMessage = async (conversation_id) => {
    const message = await Message.aggregate([
        { $match: { conversation_id: conversation_id.toString() } },
        { $sort: { timestamp: 1 } },
        { $limit: 1 },
        {$sort: {timestamp:1 }}
    ]);

    return message;
};

module.exports = {
    latestMessage
};
