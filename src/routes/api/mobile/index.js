const express = require('express');
const messageRoute = require("../mobile/message.route");

const router = express.Router();

const mobileRoutes = [
    {
        path: '/messages',
        route: messageRoute
    },
];

mobileRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;