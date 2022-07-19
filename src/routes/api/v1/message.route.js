const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const MessageController = require('../../../controllers/api/v1/message.controller');
const { MessageValidation } = require('../../../validations');

const router = express.Router();

router.get('/:conversation_id', auth, validate(MessageValidation.getMessage), MessageController.index)
router.get('/find/:id', auth, MessageController.getOne)
router.get('/:conversation_id/latest', auth, validate(MessageValidation.getMessage), MessageController.latest)
router.get('/:conversation_id/unread', auth, validate(MessageValidation.getMessage), MessageController.unread)
router.post('/', auth, MessageController.send)
router.post('/:userId', validate(MessageValidation.sendInMessage), MessageController.sendToUser)
router.post('/push/notification', auth ,MessageController.notification)
router.put('/:message_id', auth, MessageController.update)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Messages
 */
/**
 * @swagger
 * /messages/{user_name}:
 *   post:
 *     summary: Send In Message
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: user_name
 *         required: true
 *         schema:
 *           type: string
 *         description: User name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - text
 *               - link
 *             properties:
 *               author:
 *                 type: string
 *               text:
 *                 type: string
 *               link:
 *                 type: string
 *             example:
 *               author: U21102500080
 *               text: Hello 😍
 *               link: https://dribbble.com/shots/17470913-Chatdong-Chatting-Desktop-Ver
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 */
