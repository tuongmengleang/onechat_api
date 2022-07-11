const httpStatus = require('http-status');
const multer = require('multer');
const catchAsync = require('../../../utils/catchAsync');
const Message = require('../../../models/Message');
const getPagination = require('../../../utils/pagination');
const ApiError = require('../../../utils/ApiError');
const { messageService, conversationService, userService, fileService } = require('../../../services');
const { admin } = require('../../../config/firebase');
const { convert } = require('html-to-text');
const { unescapeHTML } = require('../../../utils/helpers');

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

        await Message.paginate({ conversation_id }, { offset, limit, sort: { createdAt: 'desc' } })
            .then((result) => {
                // update last messages list read_by
                // if (result.docs.length > 0)
                //     for (let i = 0 ; i < result.docs.length ; i ++) {
                //         if (req.user._id.toString() !== result.docs[i].author)
                //             messageService.updateMessageReadUnread(result.docs[i]._id, true)
                //     }
                res.send({
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
 *  @desc   Store a new message
 *  @method POST api/v1/messages
 *  @access Public
 */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 1 * 1024 * 1024 = 1MB
}).array('files', 10);
exports.create = catchAsync(async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if(err) {
                return res.status(httpStatus.BAD_REQUEST).send({ error: err.message });
            } else {
                const { conversation_id, author, text, is_compression, loading_id } = req.body;
                const files = req.files;
                if (files && files.length > 0) {
                    const filesUploaded = await Promise.all(
                        files.map(file => {
                            const data = fileService.uploadFile(req.user.user_id, file)
                            return data
                        })
                    )
                    const newMessage = new Message({
                        conversation_id: conversation_id,
                        author: author,
                        text: unescapeHTML(text),
                        files: filesUploaded,
                        is_compression: is_compression,
                        read_by: [req.user._id]
                    });
                    const _message = await newMessage.save();
                    let message = Object.assign({ loading_id }, _message._doc);
                    await conversationService.updateConversation(conversation_id);
                    // emit socket new message
                    global.io.emit("new message", message);
                    res.status(httpStatus.CREATED).json({ message: 'Successfully create message', data: message });
                }
                else {
                    const newMessage = new Message({
                        conversation_id: conversation_id,
                        author: author,
                        text: unescapeHTML(text),
                        read_by: [req.user._id]
                    });
                    const _message = await newMessage.save();
                    let message = Object.assign({ loading_id }, _message._doc);
                    //update conversation updatedAt
                    await conversationService.updateConversation(conversation_id);
                    // emit socket new message
                    global.io.emit("new message", message);
                    res.status(httpStatus.CREATED).json({ message: 'Successfully create message', data: message });
                }

            }
        })

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Send a new message specific user_id
 *  @method POST api/v1/messages/:user_id
 *  @access Public
 */
exports.sendToUser = catchAsync(async (req, res) => {
    const userId = req.params.userId;
    const { author, text } = req.body;
    const sender = await userService.getUserByUserId(author)
    const receiver = await userService.getUserByUserId(userId)
    // ******* Check if exist user in mongodb
    let user_sender = null
    let user_receiver = null
    if (!sender) {
        const user = await userService.fetchUserFromUvacancy(author)
        user_sender = await userService.createUser({
            user_id: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.picture_folder + `/medium/` + user.picture_file_name
        });
    }
    if (!receiver) {
        const user = await userService.fetchUserFromUvacancy(userId)
        user_receiver = await userService.createUser({
            user_id: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.picture_folder + `/medium/` + user.picture_file_name
        });
    }
    // Create conversation
    const conversation = await conversationService
        .createConversation(null, user_sender ? user_sender._id : sender._id, [user_receiver ? user_receiver._id : receiver._id, user_sender ? user_sender._id : sender._id])
    // Create message
    const message = await messageService.createMessage({
        conversation_id: conversation._id,
        author: user_sender ? user_sender._id : sender._id,
        text: text,
        link: '',
    })
    // emit socket new message
    global.io.emit("new message", message);
    res.send({message})
});

/**
 *  @desc   Get message by id
 *  @method GET api/v1/messages/message_id
 *  @access Public
 */
exports.getOne = catchAsync(async (req, res) => {
    try {
        const _id = req.params.id;
        const message = await Message.findOne({_id})
        res.send(message)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
})

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
                else {
                    global.io.emit("update-message", message_id);
                    res.status(httpStatus.OK).json({ message: 'Message has been updated', data });
                }
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
        const latestMessage = await messageService.latestMessage(conversation_id);
        res.status(httpStatus.OK).json(latestMessage);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});


/**
 *  @desc   Get count messages of conversation unread
 *  @method GET api/v1/conversation/unread
 *  @access Public
 */
exports.unread = catchAsync(async (req, res) => {
    try {
        const conversation_id = req.params.conversation_id;
        const count = await messageService.unreadCount(conversation_id)
        res.json(count)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
})

/**
 *  @desc   Push notification to client
 *  @method GET api/v1/conversations/notification
 *  @access Public
 */
exports.notification = catchAsync(async (req, res) => {
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };
    const { registrationToken, text, author } = req.body;

    const user = await userService.getUserById(author);
    // const registrationToken = user ? user.device_id : ''
    // res.send({ registrationToken, text, author })
    const message = {
        notification: {
            title: user ? user.full_name : '',
            body: convert(text),
            icon: user ? user.image : '',
            sound: 'default'
        },
    };

    admin.messaging().sendToDevice(registrationToken, message, options)
        .then(response => {
            res.send(response)
        })
        .catch(error => {
            console.info(error)
        })
});
