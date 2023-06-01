const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/api/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
// redis
// require('./utils/redis');

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());
// parse urlencoded | form data request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({
    // origin: config.cors,
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}));
// app.use(cors());
// app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/api/v1/auth', authLimiter);
}

// v1 api routes
app.get('/', async function(req, res) {
    res.send('Welcome to ONECHAT Server REST API 🔥🔥🔥')
});
// Route
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
