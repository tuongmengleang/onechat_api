const _ = require('lodash');
const { userService } = require('../services');
const users = [];

module.exports = (io) => {
    global.io = io;
    // ======= LISTEN CONNECTION =======
    io.on('connection', (socket) => {
        global.socket = socket;

        // ======= LISTEN USER ONLINE =======
        socket.on('online', (userId) => {
            // CHECK IS USER EXIST
            if (!users[userId]) users[userId] = []
            // PUSH SOCKET ID FOR PARTICULAR USER ID
            users[userId].push(socket.id)
            socket.userId = userId
            userService.updateUserActive(userId, true);
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
        })

        socket.on('reconnecting', function() {
            socket.connect();
        });

        socket.on('reconnect_error', function(obj) {
            socket.connect();
        });

        socket.on('reconnect_failed', function() {
            socket.connect();
        });

        // ======= LISTEN USER DISCONNECTED =======
        socket.on('disconnect', () => {
            // UPDATE USER ONLINE STATUS
            _.remove(users[socket.userId], (u) => u === socket.id)
            if (users[socket.userId] && users[socket.userId].length === 0) {
                // USER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
                userService.updateUserActive(socket.userId, false)
                // REMOVE OBJECT
                delete users[socket.userId];
            }
            socket.disconnect(); // DISCONNECT SOCKET
        });

    })
};
