const _ = require('lodash');
const { userService } = require("../services");

module.exports = class UserList {
    constructor(users = []) {
        this.users = users;
    }

    addUser(userId, socketId) {
        if (!this.users[userId]) this.users[userId] = []
        const isExist = this.users[userId].includes(socketId)
        !isExist ? this.users[userId].push(socketId) : null
    }

    async deleteUser(userId, socketId) {
        _.remove(this.users[userId], (u) => u === socketId)
        if (this.users[userId] && this.users[userId].length === 0) {
            // USER IS OFFLINE BROAD CAST TO ALL CONNECTED USERS
            await userService.updateUserActive(userId, false)
            // REMOVE OBJECT
            delete this.users[userId];
        }
    }


}
