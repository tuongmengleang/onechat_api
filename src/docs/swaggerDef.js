const { version } = require('../../package');
const config = require('../config/config');

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'Chat UVACANCY API documentation',
        version,
        license: {
            name: 'MIT',
            url: 'https://lab.onesala.com/Mengleang/onechat/-/blob/master/LICENSE'
        },
    },
    servers: [
        {
            url: `http://localhost:${config.port}/api/v1`,
        },
    ],
};

module.exports = swaggerDef;
