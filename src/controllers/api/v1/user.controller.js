const httpStatus = require('http-status');
const axios = require('axios');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const ApiError = require('../../../utils/ApiError');
const User = require('../../../models/User');
const { userService } = require('../../../services');
const { decrypt } = require('../../../utils/crypto');
const config = require('../../../config/config');

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
 *  @desc   Create user reference from uvacancy
 *  @method POST api/v1/users
 *  @access Public
 */
exports.create = catchAsync(async (req, res) => {
    try {
        const { access_token, token, user_name } = req.body;
        await axios.post(`${config.uvacancy.endpoint_url}/api/v1/profile/info`, {
            user_name: user_name
        }, {
            headers: {
                'Authorization': `Bearer ${decrypt(access_token).replace(/['"]+/g, '')}`,
                'token': decrypt(token).replace(/['"]+/g, '')
            }
        }).then(async (resp) => {
            if (resp.data.code === 200) {
                const user = await User.findOne({ user_id: resp.data.data.user_name });
                if (!user) {
                    // console.log('user :', user)
                    const newUser = await User.create({
                        user_id: resp.data.data.user_name,
                        first_name: resp.data.data.first_name,
                        last_name: resp.data.data.last_name,
                        email: resp.data.data.email ? resp.data.data.email : '',
                        phone: resp.data.data.phone_number,
                        image: resp.data.data.picture_folder + '/medium/' + resp.data.data.picture_file_name
                    })
                    res.status(httpStatus.OK).json({ user: newUser });
                }
                else
                    res.status(httpStatus.OK).json({ user });
            }
            else
                throw new ApiError(httpStatus.UNAUTHORIZED, resp.data.message);
        });

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
        const user = await userService.getUserById(req.params.userId);
        if (!user)
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');

        res.status(httpStatus.OK).json(user);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Search user by name
 *  @method GET api/v1/users/find
 *  @access Public
 */
exports.getUsers = catchAsync(async (req, res) => {
    try {
        const filter = pick(req.query, ['name']);
        // const result = await userService.queryUsers(filter.name);

        let searchString = new RegExp(filter.name, 'ig');
        if (filter.name) {
            User.aggregate().project({
                "full_name": { $concat: ['$first_name', ' ', '$last_name'] },
                "user_id": true,
                "first_name": true,
                "last_name": true,
                "email": true,
                "phone": true,
                "type": true,
                "image": true,
                "is_active": true,
                "createdAt": true,
                "updatedAt": true,
            })
                .match({ full_name: searchString })
                .exec(function (err, users) {
                    if (err) throw err;
                    const result = [];
                    for (let i = 0 ; i < users.length ; i ++) {
                        if (users[i]._id.toString() !== req.user._id.toString())
                            result.push(users[i])
                    }
                    res.send(result);
                });
        } else res.send([])
        // res.send(result)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});

/**
 *  @desc   Update user by id
 *  @method PUT api/v1/users/{id}
 *  @access Public
 */
exports.updateUser = catchAsync(async (req, res) => {
    try {
        const user = await userService.updateUserById(req.params.userId, req.body);
        res.send(user);
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
});


exports.realtime = catchAsync(async (req, res) => {
    try {
        const userId = req.params.userId
        global.io.to(userId).emit("new-emit");
        res.send(userId)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
    }
})