const express = require('express');
const auth = require('../../../middlewares/auth');
const fileController = require('../../../controllers/api/v1/file.controller');

const router = express.Router();

router.get('/', fileController.index);
router.get('/:conversationId', auth, fileController.queryFiles)

module.exports = router;
