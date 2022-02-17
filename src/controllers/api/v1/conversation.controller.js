const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const Conversation = require('../../../models/Conversation');
const ApiError = require('../../../utils/ApiError');
const { conversationService } = require('../../../services')

/**
 *  @desc   Get conversation of User
 *  @method GET api/v1/conversation/{user_id}
 *  @access Public
 */
exports.index = catchAsync(async (req, res) => {
    try {
        const user_id = req.user._id;
        const conversations = await Conversation
            .find({participants: { $in:[user_id] }})
            .populate({
                path: "participants",
                model: "User",
            })
            .sort({ updatedAt: -1 })
        // global.io.emit("new conversation");
        res.json(conversations);

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Store new conversation
 *  @method POST api/v1/conversation
 *  @access Public
 */
exports.create = catchAsync(async (req, res) => {
    try {
        const { name, creator, participants } = req.body;

        // Find Exist conversation
        const existConversation = await Conversation.findOne({ participants: { $all: participants } })

        if (!existConversation) {
            const _conversation = new Conversation({
                name: name,
                creator: creator,
                participants: participants,
            });
            await _conversation.save();

            // ****** Socket Emit to Client
            global.io.emit("new conversation", _conversation);
            res.json(_conversation)
        }
        res.status(httpStatus.FOUND).send({ message: 'Conversation is already existed!' })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Update conversation
 *  @method PUT api/v1/conversation/{conversation_id}
 *  @access Public
 */
exports.update = catchAsync(async (req, res) => {
    try {
        const conversation_id = req.params.conversation_id;
        const update = req.body;

        await Conversation.findByIdAndUpdate(conversation_id, update, { useFindAndModify: false })
            .then(data => {
                if (!data)
                    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
                else res.status(httpStatus.OK).json({ message: 'Conversation has been updated', data });
            })
            .catch(error => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            });

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Find conversation by userId
 *  @method POST api/v1/conversation/find
 *  @access Public
 */
exports.find = catchAsync(async (req, res) => {
    try {
        const conversation = await conversationService.findConversation(req.user._id, req.params.participant);
        res.send(conversation)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Count message unread of conversation
 *  @method POST api/v1/conversation/{userId}/count-unread
 *  @access Public
 */
exports.countUnread = catchAsync(async (req, res) => {
    try {
        const userId = req.params.userId
        const result = await conversationService.countConversation(userId)
        res.send({ data: result })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
})
