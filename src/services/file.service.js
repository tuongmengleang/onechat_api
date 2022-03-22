const sharp = require('sharp');
const path = require('path');
const s3Client = require('../config/minio');
const config = require('../config/config');
const Message = require('../models/Message');

/**
 * Upload File to Minio S3
 * @param {object} file
 * @returns {Promise<File>}
 */
const imageExtensions = [
    '.png',
    '.jpeg',
    '.jpg',
];
const videoExtensions = [
    '.mp4',
    '.mov',
    '.wmv',
    '.mkv',
    '.avi'
];
const uploadFile = async (userId, file, is_compression) => {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1;
    return new Promise(async(resolve, reject) => {
        const extname = path.extname(file.originalname).toLowerCase()
        const extension = file.originalname.slice((Math.max(0, file.originalname.lastIndexOf(".")) || Infinity) + 1);
        if (imageExtensions.includes(extname)) {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'images/' + `${Date.now()}-${file.originalname}`;
            if (is_compression === '1')
                await sharp(file.buffer)
                    .webp({ quality: 20 })
                    .toBuffer()
                    .then(async (data) => {
                        await s3Client.putObject(config.minio.bucketName, objectName, data)
                        resolve({ src: objectName, name: file.originalname, extension, size: data.byteLength, category: 'image' })
                    })
                    .catch( error => {
                        reject(error)
                    });
            else {
                await s3Client.putObject(config.minio.bucketName, objectName, file.buffer, (err, etag) => {
                    if (err)
                        reject(err)
                    resolve({ src: objectName, name: file.originalname, extension, size: file.size, category: 'image' })
                })
            }
        }
        else if (videoExtensions.includes(extname)) {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'videos/' + `${Date.now()}-${file.originalname}`;
            await s3Client.putObject(config.minio.bucketName, objectName, file.buffer, (err, etag) => {
                if (err)
                    reject(err)
                resolve({ src: objectName, name: file.originalname, extension, size: file.size, category: 'video' })
            })
        }
        else {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'files/' + `${Date.now()}-${file.originalname}`;
            await s3Client.putObject(config.minio.bucketName, objectName, file.buffer, (err, etag) => {
                if (err)
                    reject(err)
                resolve({ src: objectName, name: file.originalname, extension, size: file.size, category: 'docs' })
            })
        }
    })
};

/**
 * Get file by conversation id
 * @param {objectId} conversationId
 * @returns {Promise<Message>}
 */
const getFileByConversation = async (conversationId, category, limit, offset) => {
    const data = await Message.paginate(
        { conversation_id: conversationId, 'files.category': { "$in" : category } },
        { select: 'files conversation_id' ,offset, limit }
    )
    return data
}

module.exports = {
    uploadFile,
    getFileByConversation
};
