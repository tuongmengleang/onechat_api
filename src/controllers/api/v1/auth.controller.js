const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { authService, tokenService } = require('../../../services');
const { decrypt } = require('../../../utils/crypto');
const config = require('../../../config/config');

/**
 *  @desc   Log in User from UVACANCY
 *  @method POST
 *  @access Public
 */
exports.login = catchAsync(async (req, res) => {
    const { access_token, token } = req.body;

    await axios.post(`${config.uvacancy.endpoint_url}/api/v1/profile/info`, {}, {
        headers: {
            'Authorization': `Bearer ${decrypt(access_token).replace(/['"]+/g, '')}`,
            'token': decrypt(token).replace(/['"]+/g, '')
        }
    }).then(async (resp) => {
        if (resp.data.code === 200) {
            const user = await authService.loginWithToken(resp.data.data);
            const tokens = await tokenService.generateAuthTokens(user)
            // res.status(httpStatus.CREATED).send({ user, token: user.generateAuthToken() });
            res.status(httpStatus.CREATED).send({ user, access_token: tokens.access_token, refresh_token: tokens.refresh_token });
        }
        else {
            console.log("error :", resp.data)
            throw new ApiError(httpStatus.UNAUTHORIZED, resp.data.message);
        }
    });
});

/**
 * @desc Refresh token of yser
 * @method POST
 * @access Public
 */
exports.refresh = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refresh_token);
    res.send({ ...tokens });
})
