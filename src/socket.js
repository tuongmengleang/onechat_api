const logger = require('./config/logger');
const io = global.io;
io.on('connection', (socket) => {
    logger.info('a user connected :', socket)
});
module.exports = io;
