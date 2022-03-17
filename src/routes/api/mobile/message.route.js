const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const {MessageValidation} = require("../../../validations");
const MessageController = require("../../../controllers/api/mobile/message.controller");

const router = express.Router();

router.post('/:userId', validate(MessageValidation.sendInMessage), MessageController.sendInMessage)

module.exports = router;
