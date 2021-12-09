const mongoose = require('mongoose');
const _ = require('lodash');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // Create socket.io connection
const { userService } = require('./services');

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
        // CHECK IS USER EXHIST
        if (!users[data.userId]) users[data.userId] = [];

        // PUSH SOCKET ID FOR PARTICULAR USER ID
        // users[data.userId].push(socket.id);
        // saving userId to object with socket ID
        users[socket.id] = data.userId;
        console.log(users)

        // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
        // io.emit("online", users);
        // console.log(data.userId, "Is Online!", socket.id);

        // UPDATE USER STATUS ONLINE
        userService.updateUserStatus(data.userId, true);
        io.emit("new-conversation");
    });

    // listen on typing message from client
    socket.on('typing-message', (data) => {
        io.emit('display-typing', data);
    });

    // DISCONNECT EVENT
    socket.on('disconnect', (reason) => {
        // _.remove(users[users[socket.id]], (u) => u === socket.id);

        // UPDATE USER STATUS ONLINE
        userService.updateUserStatus(users[socket.id], false);
        io.emit("new-conversation");
        // remove saved socket from users object
        delete users[socket.id];
        console.log(users)
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

