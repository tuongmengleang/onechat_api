const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const messageController = require('../../../controllers/api/v1/message.controller');
const messageValidation = require('../../../validations/message.validation');

const router = express.Router();

router.route('/')
    .post(auth, validate(messageValidation.createMessage), messageController.create);

router.route('/:conversation_id')
    .get(auth, validate(messageValidation.getMessage), messageController.index);

module.exports = router;
