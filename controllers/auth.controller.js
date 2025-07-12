const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult } = require('express-validator'); // ✅ Make sure this exists

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        IsSuccess: false,
        Message: 'User not found',
        Data: null
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        IsSuccess: false,
        Message: 'Invalid credentials - Password incorrect',
        Data: null
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      IsSuccess: true,
      Message: 'Login successful',
      Data: {
        accessToken: token,
        email: user.email
      }
    });

  } catch (err) {
    next(err);
  }
};


