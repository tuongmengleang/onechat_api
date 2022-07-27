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
    }


}
