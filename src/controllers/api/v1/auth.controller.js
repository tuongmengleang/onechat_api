const axios = require('axios');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { authService } = require('../../../services');
const { decrypt } = require('../../../utils/crypto');
const CryptoJS = require("crypto-js");
/**
 *  @desc   Log in User from UVACANCY
 *  @method POST
 *  @access Public
 */
exports.login = catchAsync(async (req, res) => {
    const { access_token, token } = req.body;

    await axios.post('https://dev-api.uvacancy.com/api/v1/profile/info', {}, {
        headers: {
            'Authorization': `Bearer ${decrypt(access_token)}`,
            'token': decrypt(token)
        }
    }).then(async (resp) => {
        if (resp.data.code === 200) {
            const user = await authService.loginWithToken(resp.data.data);
            res.status(httpStatus.CREATED).send({ user, token: user.generateAuthToken() });
        }
        else
            throw new ApiError(httpStatus.UNAUTHORIZED, resp.data.message);
    });
});
