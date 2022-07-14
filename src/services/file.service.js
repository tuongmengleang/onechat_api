// const sharp = require('sharp');
const fs = require('fs');
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
const currentTime = new Date();
const currentYear = currentTime.getFullYear();
const currentMonth = currentTime.getMonth() + 1;
const uploadS3 = async (userId, file, type) => {
    return new Promise(async (resolve, reject) => {
        // const extname = file.originalFilename.toLowerCase()
        const extension = file.originalFilename.slice((Math.max(0, file.originalFilename.lastIndexOf(".")) || Infinity) + 1);
        const filename = file.originalFilename.replace(/\s/g, '-')
        const buffer = fs.readFileSync(file.path);
        // *** type = 1 (medias)
        if (type ===  1) {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'media/' + `${Date.now()}-${filename}`;
            await s3Client.putObject(config.minio.bucketName, objectName, buffer, (err, etag) => {
                if (err)
                    reject(err)
                resolve({ src: objectName, name: filename, extension, size: file.size, category: 'media' })
            })
        }
        else if (type === 2) {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'files/' + `${Date.now()}-${filename}`;
            await s3Client.putObject(config.minio.bucketName, objectName, buffer, (err, etag) => {
                if (err)
                    reject(err)
                resolve({ src: objectName, name: filename, extension, size: file.size, category: 'file' })
            })
        }

    })
}


const uploadFile = async (userId, file) => {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1;
    return new Promise(async(resolve, reject) => {
        const extname = path.extname(file.originalname).toLowerCase()
        const extension = file.originalname.slice((Math.max(0, file.originalname.lastIndexOf(".")) || Infinity) + 1);
        if (imageExtensions.includes(extname)) {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'images/' + `${Date.now()}-${file.originalname}`;
            // if (is_compression === '1')
            //     await sharp(file.buffer)
            //         .webp({ quality: 20 })
            //         .toBuffer()
            //         .then(async (data) => {
            //             await s3Client.putObject(config.minio.bucketName, objectName, data)
            //             resolve({ src: objectName, name: file.originalname, extension, size: data.byteLength, category: 'image' })
            //         })
            //         .catch( error => {
            //             reject(error)
            //         });
            // else {
            //     await s3Client.putObject(config.minio.bucketName, objectName, file.buffer, (err, etag) => {
            //         if (err)
            //             reject(err)
            //         resolve({ src: objectName, name: file.originalname, extension, size: file.size, category: 'image' })
            //     })
            // }
            await s3Client.putObject(config.minio.bucketName, objectName, file.buffer, (err, etag) => {
                if (err)
                    reject(err)
                resolve({ src: objectName, name: file.originalname, extension, size: file.size, category: 'image' })
            })
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
    const options = {
        select: 'files',
        offset,
        limit
    };
    const data = await Message.paginate(
        {
            conversation_id: conversationId,
            'files.category': { "$in" : category } ,
            'files.extension': { "$ne": 'gif' }
        },
        options,
    );
    return data.docs;
}

module.exports = {
    uploadS3,
    uploadFile,
    getFileByConversation
};
