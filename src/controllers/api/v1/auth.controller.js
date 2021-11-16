const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

/**
 *  @desc   Register User
 *  @method POST api/v1/auth/register
 *  @access Public
 */
exports.register = async (req, res) => {
    try {
        const { email } = req.body;

        // Make sure this account doesn't already exist
        const user = await User.findOne({ email });
        if (user)
            return res.status(401).json({ message: `An account with Email ${email} already exists.` });

        // hash passwords
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashPassword
        });

        const savedUser = await newUser.save();
        res.status(200).json({ data: savedUser });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 *  @desc   Login User
 *  @method POST api/v1/auth/login
 *  @access Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "The email address " + email + " is not associated with any account. Double-check your email address and try again." });

        // validate password
        if (!user.comparePassword(password)) return res.status(401).json({ message: 'Invalid credentials' });

        // Login successfully, write token and send back to client
        res.status(200).json({ token: user.generateJWT(), user: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
