const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const Message = require('../../../models/Message');
const getPagination = require('../../../utils/pagination');
const ApiError = require('../../../utils/ApiError');

/**
 *  @desc   Store a new message
 *  @method POST api/v1/messages
 *  @access Public
 */
exports.create = catchAsync(async (req, res) => {
    try {
        const { conversation_id, author, text } = req.body;

        const newMessage = new Message({
            conversation_id: conversation_id,
            author: author,
            text: text
        });
        const result = await newMessage.save();

        res.status(httpStatus.CREATED).json({ message: 'Successfully create message', result });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Get messages list
 *  @method GET api/v1/messages
 *  @access Public
 */
exports.index = catchAsync(async (req, res) => {
    try {
        const conversation_id = req.params.conversation_id;
        const { page, size } = req.query;

        const { limit, offset } = getPagination(page, size);

        await Message.paginate({ conversation_id: conversation_id }, { offset, limit, sort: { createdAt: 'desc' } })
            .then((result) => {
                res.status(200).json({
                    messages: result.docs,
                    totalItems: result.totalDocs,
                    totalPages: result.totalPages,
                    currentPage: result.page - 1
                });
            })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Update message read by user
 *  @method Put api/v1/messages/message_id
 *  @access Public
 */
exports.update = catchAsync(async (req, res) => {
    try {
        const message_id = req.params.message_id;
        const update = req.body;

        await Message.findByIdAndUpdate(message_id, update, { useFindAndModify: false })
            .then(data => {
                if (!data)
                    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
                else res.status(httpStatus.OK).json({ message: 'Message has been updated', data });
            })
            .catch(error => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Get latest messages of conversation
 *  @method GET api/v1/messages/conversation_id/latest
 *  @access Public
 */
exports.latest = catchAsync(async (req, res) => {
    try {
        const conversation_id = req.params.conversation_id;

        const latestMessage = await Message.aggregate([
            { $match: { conversation_id: conversation_id } },
            { $sort: { 'createdAt': -1 } },
            { $limit: 1 },
        ]);

        res.status(httpStatus.OK).json({ data: latestMessage });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});
