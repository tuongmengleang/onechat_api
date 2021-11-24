const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

// module.exports = (req, res, next) => {
//     passport.authenticate('jwt', function (err, user, info) {
//         if (err)
//             return next(err);
//
//         if (!user)
//             return res.status(401).json({ message: "Unauthorized Access - No Token Provided" });
//
//         req.user = user;
//
//         next();
//     })(req, res, next);
// };

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access - No Token Provided'));
    }
    req.user = user;

    resolve();
};

module.exports = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};
