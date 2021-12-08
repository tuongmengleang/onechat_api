const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // Create socket.io connection

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server.listen(config.port || 3001, () => {
        logger.info(`Listening to port ${config.port}`);
    });
});

// app.use(function(req, res, next){
//     res.io = io;
//     next();
// });
global.io = io;
const users = {};
io.on('connection', (socket) => {
    // listen on user online from client
    socket.on('login', (data) => {
        console.log('a user ' + data.userId + ' connected');
        // saving userId to object with socket ID
        users[socket.id] = data.userId;
    });

    // listen on typing message from client
    socket.on('typing-message', (data) => {
        io.emit('display-typing', data);
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

