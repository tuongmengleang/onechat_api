const Conversation = require('../models/Conversation');

/**
 * Update conversation
 * @param {ObjectId} conversation_id
 * @returns {Promise<Conversation>}
 */
const updateConversation = async (conversation_id) => {
    await Conversation.findOneAndUpdate({ _id: conversation_id }, { updatedAt: Date.now() })
    // console.log("conversation :", conversation)
};

module.exports = {
    updateConversation,
};
