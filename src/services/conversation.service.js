const Conversation = require('../models/Conversation');

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

module.exports = {
    updateConversation,
    findConversation
};
