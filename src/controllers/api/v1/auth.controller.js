const axios = require('axios');
const httpsProxyAgent = require("https-proxy-agent");
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { authService } = require('../../../services');
const { decrypt } = require('../../../utils/crypto');
const config = require('../../../config/config');

const agent = new httpsProxyAgent(`${config.uvacancy.endpoint_url}`);
/**
 *  @desc   Log in User from UVACANCY
 *  @method POST
 *  @access Public
 */
exports.login = catchAsync(async (req, res) => {
    const { access_token, token } = req.body;

    await axios.post(`${config.uvacancy.endpoint_url}/api/v1/profile/info`, {
        httpAgent: agent
    }, {
        headers: {
            'Authorization': `Bearer ${decrypt(access_token).replace(/['"]+/g, '')}`,
            'token': decrypt(token).replace(/['"]+/g, '')
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

exports.signup = catchAsync(async (req, res) => {
    const { access_token, token } = req.body;

    await axios.post(`${config.uvacancy.endpoint_url}/api/v1/profile/info`, {}, {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'token': token
        }
    }).then(async (resp) => {
        if (resp.data.code === 200) {
            const user = await authService.loginWithToken(resp.data.data);
            res.status(httpStatus.CREATED).send({ user, token: user.generateAuthToken() });
        }
        else
            throw new ApiError(httpStatus.UNAUTHORIZED, resp.data.message);
    });
})

exports.loginWithUvacancy = catchAsync(async (req, res) => {
    await axios.post(`${config.uvacancy.endpoint_url}/api/v1/login`, {
        username: 'leang.dev@gmail.com',
        password: 'Welcome.1'
    })
        .then((data) => {
            console.log('data :', data)
            res.status(httpStatus.CREATED).json(data.data);
        })
        .catch((error) => {
            console.log('error :', error)
            throw new ApiError(httpStatus.UNAUTHORIZED, error);
        })
})

exports.getCountry = catchAsync(async (req, res) => {
    await axios.post(`https://appapi.uvacancy.com/api/v1/country`)
        .then((data) => {
            // console.log('data :', data.data)
            res.json(data.data);
        })
        .catch(err => console.log('error :', err))
})