const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncErrors = require("./catchAsyncErrors");

module.exports = {
  ensureAuth: catchAsyncErrors(async (req, res, next) => {
    let token;

    console.log('req.cookies.token in auth.js middleware==', req.cookies.token);
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      req.flash('error', 'Please login to access this resource');
      // destroySessionAndRedirect(req, res);
      return res.redirect('/auth/login'); 
    }

    try {
      // First decode without verifying to get the token type
      const decodedData = jwt.decode(token);
      let secret;
      console.log('decodedData in auth.js middleware==', decodedData);

      if (decodedData.type === 'emailVerification') {
        secret = process.env.EMAIL_VERIFICATION_SECRET;
      } else if (decodedData.type === 'auth') {
        secret = process.env.JWT_SECRET;
      } else {
        throw new Error('Invalid token type');
      }

      // Verify the token with the appropriate secret
      const verifiedData = jwt.verify(token, secret);
      console.log('verifiedData in auth.js middleware==', verifiedData);

      req.user = await User.findOne({ email: verifiedData.email });
      console.log('req.user in auth.js middleware==', req.user);

      if (!req.user) {
        req.flash('error', 'You are not registered yet. Please register first.');
        destroySessionAndRedirect(req, res);
        return;
      }
      next();

    } catch (error) {
      console.error('Authentication Error:', error);
      if (error.name === 'TokenExpiredError') {
        req.flash('error', 'Your session has expired. Please log in again.');
      } else {
        req.flash('error', 'Failed to authenticate. Please try again.');
      }
      destroySessionAndRedirect(req, res);
    }
  })
};

const destroySessionAndRedirect = (req, res, redirectUrl = '/auth/login') => {
  req.session.destroy(err => {
    if (err) {
      console.error('Failed to destroy session:', err);
    }
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return res.redirect(redirectUrl);
  });
};
