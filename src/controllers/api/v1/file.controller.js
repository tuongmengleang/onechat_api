const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const s3Client = require('../../../config/minio');
const axios = require('axios');
const config = require('../../../config/config');

/**
 *  @desc   Get Image base64
 *  @method GET api/v1/file/image
 *  @access Public
 */
exports.image64 = catchAsync(async (req, res) => {
   try {
       const path = req.query.path;
       let publicUrl = s3Client.protocol + '//' + s3Client.host + ':' + s3Client.port + '/' + config.minio.bucketName + '/' + path;
       const response = await axios.get(publicUrl, { responseType: 'arraybuffer' });
       let image64 = Buffer.from(response.data).toString('base64');
       res.json(image64)
   } catch (error) {
       res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
   }
});

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
