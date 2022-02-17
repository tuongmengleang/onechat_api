const express = require('express');
const auth = require('../../../middlewares/auth');
const UserController = require('../../../controllers/api/v1/user.controller');
const validate = require('../../../middlewares/validate');
const { UserValidation } = require('../../../validations');

const router = express.Router();

router.route('/')
    .get(auth, UserController.getUsers)
    .post(auth, UserController.create)

router.get('/me', auth, UserController.me)

router.route('/:userId')
    .get(auth, validate(UserValidation.getUser), UserController.getUser)
    .patch(auth, validate(UserValidation.updateUser), UserController.updateUser)

module.exports = router;
