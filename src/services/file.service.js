const sharp = require('sharp');
const path = require('path');
const s3Client = require('../config/minio');
const config = require('../config/config');

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
const uploadFile = async (userId, file) => {
    const currentTime = new Date();
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth() + 1;
    return new Promise(async(resolve, reject) => {
        const extname = path.extname(file.originalname).toLowerCase()
        const extension = file.originalname.slice((Math.max(0, file.originalname.lastIndexOf(".")) || Infinity) + 1);
        if (imageExtensions.includes(extname)) {
            const objectName = userId + '/' + currentYear + '/' + currentMonth + '/' + 'images/' + `${Date.now()}-${file.originalname}`;
            await sharp(file.buffer)
                // .resize(1000)
                // .jpeg({ progressive: true, force: false })
                // .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
                .webp({ quality: 20 })
                // .png({quality: 95, compression: 6,})
                .toBuffer()
                .then(async (data) => {
                    await s3Client.putObject(config.minio.bucketName, objectName, data)
                    resolve({ src: objectName, name: file.originalname, extension, size: file.size, category: 'image' })
                })
                .catch( error => {
                    reject(error)
                });
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

module.exports = {
    uploadFile,
};
