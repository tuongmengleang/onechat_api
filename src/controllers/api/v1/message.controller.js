const Message = require('../../../models/Message');
const { getPagination } = require('../../../utils/pagination');

/**
 *  @desc   Store a new message
 *  @method POST api/v1/messages
 *  @access Public
 */
exports.create = async (req, res) => {
    try {
        const { conversation_id, author, text } = req.body;

        const newMessage = new Message({
            conversation_id: conversation_id,
            author: author,
            text: text
        });
        const result = await newMessage.save();

        res.status(200).json({ message: 'Successfully create message', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 *  @desc   Get messages list
 *  @method GET api/v1/messages
 *  @access Public
 */
exports.index = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};
