const express = require('express');
const authenticated = require('../../../middlewares/authenticated');
const conversationValidation = require('../../../validations/conversation.validation');
const conversationController = require('../../../controllers/api/v1/conversation.controller');

const router = express.Router();

router.post('/', authenticated, conversationController.create);
router.get('/:user_id', authenticated, conversationController.index);
router.put('/:conversation_id', authenticated, conversationController.update);

module.exports = router;
