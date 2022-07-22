const _ = require('lodash');
const UserList = require('../utils/users');
const { userService, messageService } = require('../services');
const userList = new UserList();

module.exports = (io) => {
    global.io = io;
    // ======= LISTEN CONNECTION =======
    io.on('connection', (socket) => {
        global.socket = socket;

        socket.on('subscribe', (data) => {
            socket.join(data)
        })

        // ======= LISTEN USER ONLINE =======
        socket.on('online', (userId) => {
            userList.addUser(userId, socket.id)
            socket.userId = userId
            userService.updateUserActive(userId, true);
        });

        // ======= LISTEN USER OFFLINE =======
        socket.on('offline', async (userId) => {
            await userList.deleteUser(userId, socket.id)
        });

        socket.on('user-typing', (data) => {
            socket.broadcast.emit('user-typing', data);
        })

        socket.on('read-message', async (payload) => {
            await messageService.updateMessageReadUnread(payload, true)
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
        socket.on('disconnect', async () => {
            await userList.deleteUser(socket.userId, socket.id)
            socket.disconnect(); // DISCONNECT SOCKET
        });

    })
};
