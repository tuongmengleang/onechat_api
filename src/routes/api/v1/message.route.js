const express = require('express');
const authenticated = require('../../../middlewares/authenticated');
const validate = require('../../../middlewares/validate');
const messageController = require('../../../controllers/api/v1/message.controller');
const messageValidation = require('../../../validations/message.validation');

const router = express.Router();

router.route('/')
    .post(authenticated, validate(messageValidation.createMessage), messageController.create);

router.route('/:conversation_id')
    .get(authenticated, validate(messageValidation.getMessage), messageController.index);

module.exports = router;
