// const httpStatus = require('http-status');
const Message = require('../models/Message');
const { unescapeHTML } = require('../utils/helpers');

/**
 * Create Message
 * @param {ObjectId} payload
 * @returns {Promise<Messages>}
 */
const createMessage = async (payload) => {
    const newMessage = new Message({
        conversation_id: payload.conversation_id,
        author: payload.author,
        text: unescapeHTML(payload.text),
        link: payload.link
    });
    const message = await newMessage.save();
    return message
};

/**
 * Update message by id
 * @param {ObjectId} id
 * @returns {Promise<Messages>}
 */
const updateMessageReadUnread = async (payload, is_read) => {
    try {
        // const message = await Message.findOneAndUpdate({ _id }, { is_read: is_read }, { new: true })
        await Message.updateMany({ is_read: false }, { is_read }, {upsert: true})
        // console.log('data :', data);
        global.io.emit('read-message', payload)
    } catch (error) {
        console.log('error :', error)
    }
};

/**
 * Get latest message of conversation
 * @param {ObjectId} conversation_id
 * @returns {Promise<Messages>}
 */
const latestMessage = async (conversation_id) => {
    const message = await Message.findOne({ conversation_id: conversation_id }).sort({ 'createdAt': -1 })
    return message;
};

/**
 * Get count message unread of conversation
 * @param {ObjectId} conversation_id
 * @returns {Promise<Messages>}
 */
const unreadCount = async (conversation_id) => {
    const result = await Message.aggregate([
        { $match: { conversation_id } },
        { $group: { _id: conversation_id, unreadCount: { $sum: { $cond: [{ $eq: ["$is_read", false] }, 1, 0] } } } },
        { $limit: 1 },
    ]);
    return result[0]
}

module.exports = {
    createMessage,
    updateMessageReadUnread,
    latestMessage,
    unreadCount
};
