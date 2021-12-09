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
    // socket.on('login', (userId) => {
    //     // CHECK IS USER EXHIST
    //     if (!users[userId]) users[userId] = [];
    //     // PUSH SOCKET ID FOR PARTICULAR USER ID
    //     users[userId].push(socket.id);
    //     // USER IS ONLINE BROAD CAST TO ALL CONNECTED USERS
    //     io.sockets.emit("online", userId);
    //     userService.updateUserStatus(userId, true)
    //     io.emit("new-conversation");
    //     // console.log("list user online :", users)
    //     // console.log(userId, "Is Online!", socket.id);
    // })

    // listen on typing message from client
    socket.on('typing-message', (data) => {
        io.emit('display-typing', data);
    });

    // // LISTEN USER DISCONNECTED
    // socket.on('disconnect', () => {
    //     socket.broadcast.emit('user-disconnected', users[socket.id])
    //     delete users[socket.id]
    //     console.log("list user online :", users)
    // })

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

