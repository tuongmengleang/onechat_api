const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const s3Client = require('../../../config/minio');
const config = require('../../../config/config');
const {fileService} = require("../../../services");
const getPagination = require("../../../utils/pagination");

/**
 *  @desc   Get MinIO object storage
 *  @method GET api/v1/file/list
 *  @access Public
 */
exports.index = catchAsync(async (req, res) => {
    try {
        // presigned url for 'getObject' method.
        // expires in a day.
        s3Client.presignedUrl('GET', config.minio.bucketName, 'daniel-bernard-9IczadI8G2w-unsplash.jpeg', 24*60*60, function(err, presignedUrl) {
            if (err) return console.log(err)
            res.send(presignedUrl)
        })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});


/**
 * @desc Get Media by conversation id
 * @method GET api/v1/file/:conversationId
 * @access Public
 */
exports.queryFiles = catchAsync(async (req, res) => {
    try {
        const conversation_id = req.params.conversationId;
        const { page, size, category } = req.query;

        const { limit, offset } = getPagination(page, size);
        const files = await fileService.getFileByConversation(conversation_id, category, limit, offset)
        res.json(files)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});