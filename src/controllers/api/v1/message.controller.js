const httpStatus = require('http-status');
const multer = require('multer');
const catchAsync = require('../../../utils/catchAsync');
const Message = require('../../../models/Message');
const getPagination = require('../../../utils/pagination');
const ApiError = require('../../../utils/ApiError');
const { messageService, conversationService, userService, fileService } = require('../../../services');
const { admin } = require('../../../config/firebase');
const { convert } = require('html-to-text');

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
                const { conversation_id, author, text, is_group } = req.body;
                const files = req.files;
                if (files && files.length > 0) {
                    if (is_group === 'true') {
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
                            read_by: [req.user._id]
                        });
                        const _message = await newMessage.save();
                        await conversationService.updateConversation(conversation_id);
                        // emit socket new message
                        global.io.emit("new message", _message);
                        res.status(httpStatus.CREATED).json({ message: 'Successfully create message', data: _message });
                    } else if (is_group === 'false') {
                        let _message = null
                        const filesUploaded = await Promise.all(
                            files.map(async (file) => {
                                await fileService.uploadFile(req.user.user_id, file)
                                    .then(async (data) => {
                                        // console.info('data :', data)
                                        const newMessage = new Message({
                                            conversation_id: conversation_id,
                                            author: author,
                                            text: unescapeHTML(text),
                                            files: [data],
                                            read_by: [req.user._id]
                                        });
                                        _message = await newMessage.save();
                                        await conversationService.updateConversation(conversation_id);
                                        // emit socket new message
                                        global.io.emit("new message", _message);
                                    })
                            })
                        );
                        res.status(httpStatus.CREATED).json({ message: 'Successfully create message', data: _message });
                    }
                }
                else {
                    const newMessage = new Message({
                        conversation_id: conversation_id,
                        author: author,
                        text: unescapeHTML(text),
                        read_by: [req.user._id]
                    });
                    const _message = await newMessage.save();
                    //update conversation updatedAt
                    await conversationService.updateConversation(conversation_id);
                    // emit socket new message
                    global.io.emit("new message", _message);
                    res.status(httpStatus.CREATED).json({ message: 'Successfully create message', data: _message });
                }

            }
        })

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Upload message file
 *  @method POST api/v1/messages
 *  @access Public
 */
exports.uploadFile = catchAsync(async (req, res) => {
    await fileService.uploadFiles(req, res)
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
                // update last messages list read_by
                if (result.docs.length > 0)
                    for (let i = 0 ; i < result.docs.length ; i ++) {
                        if (req.user._id.toString() !== result.docs[i].author)
                            messageService.updateMessageReadUnread(result.docs[i]._id, true)
                    }
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
        }
    };

    admin.messaging().sendToDevice(registrationToken, message, options)
        .then(response => {
            res.send(response)
        })
        .catch(error => {
            console.info(error)
        })
});


function unescapeHTML(escapedHTML) {
    if (escapedHTML)
        return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

// .replace(/\n/ig, '')
//     .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
//     .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
//     .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')
//     .replace(/<\/\s*(?:p|div)>/ig, '\n')
//     .replace(/<br[^>]*\/?>/ig, '\n')
//     .replace(/<[^>]*>/ig, '')
//     .replace('&nbsp;', ' ')
//     .replace(/[^\S\r\n][^\S\r\n]+/ig, ' '),
