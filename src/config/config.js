const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(3001),
        MONGODB_URI: Joi.string().required().description('Mongo DB url'),
        REDIS_URI: Joi.string().required().description('Redis url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        CRYPTO_SECRET_KEY: Joi.string().required().description('Secret key encrypt token'),
        MINIO_ENDPOINT: Joi.string().required().description('Minio endpoint'),
        MINIO_PORT: Joi.string().required().description('Minio port'),
        MINIO_ACCESS_KEY: Joi.string().required().description('Minio access key'),
        MINIO_SECRET_KEY: Joi.string().required().description('Minio secret key'),
        MINIO_BUCKET_NAME: Joi.string().required().description('Minio bucket name'),
        SOCKET_ORIGIN_1: Joi.string().required().description('Socketio access origin url'),
        SOCKET_ORIGIN_2: Joi.string().required().description('Socketio access origin url'),
        CORS_ORIGIN: Joi.string().required().description('Cors origin access url'),
        UVACANCY_ENDPOINT_URL: Joi.string().required().description('Uvacancy endpoint url'),
        MAX_FILE_VALIDATE_SIZE: Joi.string().required().description('MAX_FILE_VALIDATE_SIZE is required env'),
        MAX_FILE_VALIDATE_LENGTH: Joi.string().required().description('MAX_FILE_VALIDATE_LENGTH is required env')
    }).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URI + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useNewUrlParser: false,
            useUnifiedTopology: true,
        },
    },
    redis_uri: envVars.REDIS_URI,
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    crypto_secret_key: envVars.CRYPTO_SECRET_KEY,
    minio: {
        endPoint: envVars.MINIO_ENDPOINT,
        port: envVars.MINIO_PORT,
        accessKey: envVars.MINIO_ACCESS_KEY,
        secretKey: envVars.MINIO_SECRET_KEY,
        bucketName: envVars.MINIO_BUCKET_NAME
    },
    socketio: {
        origins: [ envVars.SOCKET_ORIGIN_1, envVars.SOCKET_ORIGIN_2 ]
    },
    cors: {
        origin: envVars.CORS_ORIGIN
    },
    uvacancy: {
        endpoint_url: envVars.UVACANCY_ENDPOINT_URL
    },
    file: {
        max_size: envVars.MAX_FILE_VALIDATE_SIZE,
        max_length: envVars.MAX_FILE_VALIDATE_LENGTH
    }
};
