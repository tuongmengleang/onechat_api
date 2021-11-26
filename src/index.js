const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const server = require('http').createServer(app);
const WebSocket = require('ws');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server.listen(config.port || 3001, () => {
        logger.info(`Listening to port ${config.port}`);
    });

    //initialize the WebSocket server instance
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        logger.info("A new client connected");
    })
});

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

