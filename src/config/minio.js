const Minio = require('minio');
const config = require('./config');

const s3Client = new Minio.Client({
    endPoint: config.minio.endPoint,
    port: 9000,
    useSSL: false,
    bucket: config.minio.bucketName,
    accessKey: config.minio.accessKey,
    secretKey: config.minio.secretKey
});

module.exports = s3Client;
