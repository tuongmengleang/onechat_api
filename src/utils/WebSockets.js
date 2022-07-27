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
        socket.on('online', async (userId) => {
            userList.addUser(userId, socket.id)
            socket.userId = userId
            await userService.updateUserActive(userId, true);
        });

        // ======= LISTEN USER OFFLINE =======
        socket.on('offline', async (userId) => {
            await userList.deleteUser(userId, socket.id)
            await userService.updateUserActive(userId, false)
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

        socket.on('reconnect_error', function() {
            socket.connect();
        });

        socket.on('reconnect_failed', function() {
            socket.connect();
        });

        // ======= LISTEN USER DISCONNECTED =======
        socket.on('disconnect', async () => {
            await userList.deleteUser(socket.userId, socket.id)
            if (userList.users[socket.userId] && userList.users[socket.userId].length === 0) {
                // USER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
                await userService.updateUserActive(socket.userId, false)
                // REMOVE OBJECT
                delete userList.users[socket.userId];
            }
            socket.disconnect(); // DISCONNECT SOCKET
        });

    })
};
