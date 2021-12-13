const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const Conversation = require('../../../models/Conversation');
const ApiError = require('../../../utils/ApiError');

/**
 *  @desc   Get conversation of User
 *  @method GET api/v1/conversation/{user_id}
 *  @access Public
 */
exports.index = catchAsync(async (req, res) => {
    try {
        const user_id = req.user._id;
        const conversations = await Conversation.find({
            participants: { $in:[user_id.toString()] }
        }).sort({ updatedAt: -1 })
            //.cache({ expire: 10 });

        // emit socket new conversation
        global.io.emit("new-conversation");
        res.status(200).json(conversations);

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

    const { name, creator, participants } = req.body;

    const conversation = new Conversation({
        name: name,
        creator: creator,
        participants: participants
    });

    try {
        const result = await conversation.save();
        // emit socket new conversation
        global.io.emit("new-conversation");
        res.status(httpStatus.CREATED).send(result);
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
