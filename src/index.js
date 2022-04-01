const mongoose = require('mongoose');
const fs = require('fs');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

// ssl
// const httpsOptions = {
//     cert: fs.readFileSync(__dirname + '/ssl/__uvacancy_com.crt'),
//     ca: fs.readFileSync(__dirname + '/ssl/__uvacancy_com.ca-bundle'),
//     key: fs.readFileSync(__dirname + '/ssl/uvacancy.key')
// }

const server = require('https').createServer(app);
const socketio = require('socket.io')(server, { cors: { origin: '*' } });
require('./utils/WebSockets')(socketio);

// *** MongoDB Connection
mongoose.Promise = Promise;
mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        logger.info('Connected to MongoDB');
        server.listen(config.port || 3001, () => {
            logger.info(`Listening to port ${config.port}`);
        });
    })
    .catch(error => {
        logger.warn('Failed connect to MongoDB :', error);
    })

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

