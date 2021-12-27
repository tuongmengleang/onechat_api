const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const User = require('../models/User')

/**
 * Update conversation
 * @param {ObjectId} conversation_id
 * @returns {Promise<Conversation>}
 */
const updateConversation = async (conversation_id) => {
    await Conversation.findOneAndUpdate({ _id: conversation_id }, { updatedAt: Date.now() })
};

/**
 * Find conversation by userId
 * @param {ObjectId} userId
 * @returns {Promise<Conversation>}
 */
const findConversation = async (creator, userId) => {
    const result = await Conversation.findOne({ participants : { '$all': [userId, creator.toString()] } });
    return result
}

/**
 * Count conversation unread message
 * @param {ObjectId} userId
 * @returns {Promise<Conversation>}
 */
const countConversation = async (userId) => {
    // Find User by user_name from uvacancy
    const user = await User.findOne({ user_id: userId })
    if (!user)
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

    // Find Conversation by user id
    let count = 0;
    const conversations = await Conversation.find({ participants : { "$in": [ user._id.toString() ] } });
    if (conversations.length > 0) {
        for (let i = 0 ; i < conversations.length ; i++) {
            const message = await Message.findOne({ conversation_id: conversations[i]._id }, null, { sort: { 'updatedAt' : -1 } })
            if (!message.is_read && message.author != user._id.toString()) {
                count += 1
            }
            // console.log('author :', message.author)
            // console.log('user id :', user._id)
        }
    }
    return count
}

module.exports = {
    updateConversation,
    findConversation,
    countConversation
};
