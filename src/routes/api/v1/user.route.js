const express = require('express');
const auth = require('../../../middlewares/auth');
const UserController = require('../../../controllers/api/v1/user.controller');
const validate = require('../../../middlewares/validate');
const { UserValidation } = require('../../../validations');

const router = express.Router();

router.get('/', UserController.index);
router.get('/me', auth, UserController.me);
router.get('/:user_id', auth, validate(UserValidation.getUser), UserController.getUser);

module.exports = router;
