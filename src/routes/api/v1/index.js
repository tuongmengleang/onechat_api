const express = require('express');
const config = require('../../../config/config');
const docsRoute = require('./docs.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const conversationRoute = require('./conversation.route');
const messageRoute = require('./message.route');
const fileRoute = require('./file.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/conversations',
        route: conversationRoute
    },
    {
        path: '/messages',
        route: messageRoute
    },
    {
        path: '/file',
        route: fileRoute
    }
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}

module.exports = router;
