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
    .get(auth, validate(messageValidation.getMessage), MessageController.latest)

router.route('/:conversation_id/unread')
    .get(auth, validate(messageValidation.getMessage), MessageController.unread)

router.route('/:message_id')
    .put(auth, MessageController.update);

router.route('/notification')
    .post(auth, MessageController.notification)


module.exports = router;
