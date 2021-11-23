const express = require('express');
const authenticated = require('../../../middlewares/authenticated');
const validate = require('../../../middlewares/validate');
const conversationValidation = require('../../../validations/conversation.validation');
const conversationController = require('../../../controllers/api/v1/conversation.controller');

const router = express.Router();

router.route('/')
    .post(authenticated, validate(conversationValidation.createConversation), conversationController.create)

router.route('/:user_id')
    .get(authenticated, conversationController.index)

router.route('/:conversation_id')
    .put(authenticated, validate(conversationValidation.updateConversation), conversationController.update)

module.exports = router;
