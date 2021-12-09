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

const getUnread = async (conversation_id) => {
    // const messages = await Message.aggregate([
    //     { $match: { conversation_id: conversation_id } }
    // ]);
    // const message = await Message.find({read_by: 'user#83'});
    const message = await Message.find({conversation_id: conversation_id}, { 'read_by': { $gte: 'user#83' } });

    return message
};

module.exports = {
    latestMessage,
    getUnread
};
