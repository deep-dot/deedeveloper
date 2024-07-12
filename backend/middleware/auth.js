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
      req.user = null;  // Clear req.user
      return res.redirect('/auth/login');
    }

    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({ email: decodedData.email });

      if (!req.user) {
        req.flash('error', 'No user found');
        return res.redirect('/auth/login');
      }

      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      
      req.user = null;  // Clear req.user
      if (error.name === 'TokenExpiredError') {
        req.flash('error', 'Your session has expired. Please log in again.');
        return res.redirect('/logout');  // Redirect to logout route
      } else {
        req.flash('error', 'Failed to authenticate. Please try again.');
        return res.redirect('/auth/login');
      }
    }
  })
};
