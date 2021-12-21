const admin = require('firebase-admin');
const serviceAccount = require('../onechat-19d9d-firebase-adminsdk-mj0ny-348e67cb24')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports.admin = admin;
