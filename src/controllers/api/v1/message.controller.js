const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const Message = require('../../../models/Message');
const getPagination = require('../../../utils/pagination');
const ApiError = require('../../../utils/ApiError');
const { messageService, conversationService, userService } = require('../../../services');
const { admin } = require('../../../config/firebase');
const { convert } = require('html-to-text');

// test push notification
exports.notification = catchAsync(async (req, res) => {
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };
    const { registrationToken, text, author } = req.body;

    const user = await userService.getUserById(author);

    const message = {
        notification: {
            title: user ? user.full_name : '',
            body: convert(text)
                .replace(/\n/ig, '')
                .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
                .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')
                .replace(/<\/\s*(?:p|div)>/ig, '\n')
                .replace(/<br[^>]*\/?>/ig, '\n')
                .replace(/<[^>]*>/ig, '')
                .replace('&nbsp;', ' ')
                .replace(/[^\S\r\n][^\S\r\n]+/ig, ' ')
        }
    };

    admin.messaging().sendToDevice(registrationToken, message, notification_options)
        .then(response => {
            res.send(response)
        })
        .catch(error => {
            console.info(error)
        })
});

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
            text: unescapeHTML(text),
            read_by: [req.user._id]
        });

        const result = await newMessage.save();
        // update conversation updatedAt
        await conversationService.updateConversation(conversation_id);
        // emit socket new message
        global.io.emit("send-message", result);

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
                // update last messages list read_by
                if (result && result.docs && result.docs.length > 0)
                    for (let i = 0 ; i < result.docs.length ; i ++)
                        messageService.updateMessageReadUnread(result.docs[i]._id, true)
                res.send({
                    messages: result.docs,
                    // last_message: result.docs.slice(-1)[0],
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
                else {
                    global.io.emit("update-message");
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


function unescapeHTML(escapedHTML) {
    return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}
