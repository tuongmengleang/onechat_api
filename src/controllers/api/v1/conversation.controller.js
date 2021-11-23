const Conversation = require('../../../models/Conversation');

/**
 *  @desc   Get conversation of User
 *  @method GET api/v1/conversation/{user_id}
 *  @access Public
 */
exports.index = async (req, res) => {
    try {

        const conversations = await Conversation.find({
            participants: { $in:[req.params.user_id] }
        }).sort({ timestamp: -1 }).cache({ expire: 10 });

        res.status(200).json({ conversations });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 *  @desc   Store new conversation
 *  @method POST api/v1/conversation
 *  @access Public
 */
exports.create = async (req, res) => {

    const { name, creator, participants } = req.body;

    const conversation = new Conversation({
        name: name,
        creator: creator,
        participants: participants
    });

    try {
        const result = await conversation.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 *  @desc   Update conversation
 *  @method PUT api/v1/conversation/{conversation_id}
 *  @access Public
 */
exports.update = async (req, res) => {
    try {
        const conversation_id = req.params.conversation_id;
        const update = req.body;

        const conversation = await Conversation.findByIdAndUpdate(conversation_id, { $set: update }, { new: true });
        res.status(200).json({ message: 'Conversation has been updated', conversation });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
