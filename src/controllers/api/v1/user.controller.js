const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const ApiError = require('../../../utils/ApiError');
// const User = require('../../../models/User');
const { userService } = require('../../../services');

/**
 *  @desc   Get list of Users
 *  @method GET api/v1/users
 *  @access Public
 */
exports.index = catchAsync(async (req, res) => {
    try {
        const users = await userService.queryUsers();

        res.status(httpStatus.OK).json({ users })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Get Current user logged
 *  @method GET api/v1/users/me
 *  @access Public
 */
exports.me = catchAsync(async (req, res) => {
    try {
        const me = req.user;
        res.status(httpStatus.OK).json({ user: me });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Get User by id
 *  @method GET api/v1/users/{id}
 *  @access Public
 */
exports.getUser = catchAsync(async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.user_id);
        if (!user)
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');

        res.status(httpStatus.OK).json(user);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});
