const httpStatus = require('http-status');
const multer = require('multer');
const sharp = require('sharp');
const s3Client = require('../config/minio');
const config = require('../config/config');
const path = require('path')
const fs = require('fs')

const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
];
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 1 * 1024 * 1024 = 1MB
    // fileFilter: (req, file, cb) => {
    //     if (!whitelist.includes(file.mimetype))
    //         return cb(new Error('Only .png, .jpg and .jpeg format allowed!!😢😢'), false)
    //     else
    //         cb(null, true)
    // }
    fileFilter: (req, file, cb) => {
        // accept image only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!😢😢'), false);
        }
        cb(null, true);
    }
}).array('files[]', 10);
/**
 * Upload File to Minio S3
 * @param {object} file
 * @returns {Promise<File>}
 */
const uploadFiles = async (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            return res.status(httpStatus.BAD_REQUEST).send({ error: err });
        } else {
            const files = req.files;
            const currentTime = new Date();
            const currentYear = currentTime.getFullYear();
            const currentMonth = currentTime.getMonth() + 1;
            if (files && files.length > 0) {
                const filesUploaded = files.map((file) => {
                    const { filename: image } = file
                    // console.info('file :', file)
                    const objectName = req.user.user_id + '/' + currentYear + '/' + currentMonth + '/' + `${Date.now()}-${file.originalname}`;
                    sharp(objectName)
                        // .jpeg({ quality: 50 })
                        // .toFile(
                        //     req.user.user_id + '/' + currentYear + '/' + currentMonth + '/' + 'resized/' + `${Date.now()}-${file.originalname}`
                        // )
                        .resize(330,null)
                        .flatten()
                        .toFile('newFile.jpg', function(err){
                            if(err){
                                res.sendStatus(500);
                                return;
                            }
                            res.sendFile('newFile.jpg');
                        });
                    s3Client.putObject(config.minio.bucketName, objectName, file.buffer)
                });
                Promise.all(filesUploaded)
                    .then(() => {
                        res.send({ message: "Upload files successfully!" })
                    })
                    .catch(() => {
                        res.status(httpStatus.BAD_REQUEST).send({ error: 'Error uploading file' })
                    })
            }
            else {
                res.status(httpStatus.BAD_REQUEST).send({ error: 'Please select a file to upload!👌' })
            }
        }
    })
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
});
const singUpload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1000 * 5000 },
}).single('image');
const compressFile = async(req, res) => {
    singUpload(req, res, async(err) => {
        if(err) {
            return res.status(httpStatus.BAD_REQUEST).send({ error: err });
        } else {
            const { filename: image } = req.file
            console.log("path :", req.file.path)
            await sharp(req.file.path)
                .jpeg({ quality: 50 })
                .toFile(
                    path.resolve(req.file.destination,'resized',image)
                )
            fs.unlinkSync(req.file.path)

            return res.send('SUCCESS!')
        }
    })
};

module.exports = {
    uploadFiles,
    compressFile
}
