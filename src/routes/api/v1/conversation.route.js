const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const conversationValidation = require('../../../validations/conversation.validation');
const conversationController = require('../../../controllers/api/v1/conversation.controller');

const router = express.Router();

router.route('/')
    .post(auth, validate(conversationValidation.createConversation), conversationController.create)
    .get(auth, conversationController.index)

router.route('/:conversation_id')
    .put(auth, validate(conversationValidation.updateConversation), conversationController.update)

router.get('/:participant', auth, conversationController.find)
router.get('/:userId/count-unread', conversationController.countUnread)

module.exports = router;
