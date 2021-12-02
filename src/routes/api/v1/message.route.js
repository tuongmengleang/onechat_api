const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const MessageController = require('../../../controllers/api/v1/message.controller');
const messageValidation = require('../../../validations/message.validation');

const router = express.Router();

router.route('/')
    .post(auth, validate(messageValidation.createMessage), MessageController.create);

router.route('/:conversation_id')
    .get(auth, MessageController.index)

router.route('/:conversation_id/latest')
    .get(auth, MessageController.latest)

router.route('/:message_id')
    .put(auth, MessageController.update);

module.exports = router;
