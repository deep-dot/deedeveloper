const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncErrors = require("./catchAsyncErrors");

module.exports = {
  ensureAuth: catchAsyncErrors(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      req.flash('error', 'Please login to access this resource');
      return res.redirect('/auth/login');
    }

    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
     // console.log('decodedData in middleware==', decodedData)
      req.user = await User.findOne({ email: decodedData.email });
      if (!req.user) {
        req.flash('error', 'No user found');
        return res.redirect('/auth/login');
      }
      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      req.flash('error', 'Failed to authenticate. Please try again.');
      return res.redirect('/auth/login');
    }
  })
};
