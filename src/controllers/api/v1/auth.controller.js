const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { authService, tokenService } = require('../../../services');
const { encrypt, decrypt } = require('../../../utils/crypto');
const config = require('../../../config/config');

/**
 *  @desc   Log in User from UVACANCY
 *  @method POST
 *  @access Public
 */
exports.login = catchAsync(async (req, res) => {
    const { token } = req.body;

    await axios.post(`${config.uvacancy.endpoint_url}/api/v2/profile/get-user-info`, {}, {
        // headers: {
        //     'Authorization': `Bearer ${decrypt(access_token).replace(/['"]+/g, '')}`,
        //     'token': decrypt(token).replace(/['"]+/g, '')
        // }
        headers: {
            'Authorization': `Bearer ${token.replace(/['"]+/g, '')}`
        }
    }).then(async (resp) => {
        if (resp.data.code === 200) {
            const user = await authService.loginWithToken(resp.data.data);
            const tokens = await tokenService.generateAuthTokens(user)
            // res.status(httpStatus.CREATED).send({ user, token: user.generateAuthToken() });
            res.status(httpStatus.CREATED).send({ user, access_token: tokens.access_token, refresh_token: tokens.refresh_token });
        }
        else {
            throw new ApiError(httpStatus.UNAUTHORIZED, resp.data.message);
        }
    });
});

/**
 * @desc Login user with email/phone, password
 * @method POST
 * @access Public
 */
exports.loginUsernamePassword = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    await axios.post(`${config.uvacancy.endpoint_url}/api/v1/login`, {
        username, password
    }, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (resp.data.code === 200)
            res.status(httpStatus.OK).json({
                user: resp.data.data.data,
                access_token: encrypt(resp.data.data.access_token),
                token: encrypt(resp.data.data.token)
            })
        else res.status(httpStatus.BAD_REQUEST).json(resp.data)
    }).catch(error => {
        res.status(httpStatus.BAD_REQUEST).json({ message: error.message })
    })

})

/**
 * @desc Refresh token of yser
 * @method POST
 * @access Public
 */
exports.refresh = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refresh_token);
    res.send({ ...tokens });
})
