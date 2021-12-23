const mongoose = require('mongoose');
const _ = require('lodash');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // Create socket.io connection
const { userService, messageService } = require('./services');

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info('Connected to MongoDB');
    server.listen(config.port || 3001, () => {
        logger.info(`Listening to port ${config.port}`);
    });
});

global.io = io;
const users = {};
io.on('connection', (socket) => {
    socket.on('online', (userId) => {
        // CHECK IS USER EXIST
        if (!users[userId]) users[userId] = []
        // PUSH SOCKET ID FOR PARTICULAR USER ID
        users[userId].push(socket.id)
        socket.userId = userId
        userService.updateUserStatus(userId, true)
        // console.info('users: ', users)
    });

    // listen on typing message from client
    socket.on('typing-message', (data) => {
        io.emit('display-typing', data);
    });

    // listen on update message readed
    // socket.on('update-message-read', async(data) => {
    //     await messageService.updateMessageReadUnread(data._id, true)
    //     io.emit('update-message-read', data)
    // });

    // // LISTEN USER DISCONNECTED
    socket.on('disconnect', () => {
        _.remove(users[socket.userId], (u) => u === socket.id)
        if (users[socket.userId].length === 0) {
            // USER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
            // UPDATE USER ONLINE STATUS
            userService.updateUserStatus(socket.userId, false)
            // io.emit("offline", socket.userId);
            // REMOVE OBJECT
            delete users[socket.userId];
        }
        socket.disconnect(); // DISCONNECT SOCKET

        // console.info('users: ', users)
    });

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

