const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncErrors = require("./catchAsyncErrors");

const destroySessionAndRedirect = (req, res, redirectUrl = '/auth/login') => {

  if (req.isAuthenticated && req.isAuthenticated()) {
    // Use Passport's logout if the user is authenticated via Passport
    req.logout(err => {
      if (err) {
        console.error('Failed to logout:', err);
      }
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      req.user = null;
      return res.redirect(redirectUrl);
    });
  } else {
    // Handle custom logout
    req.session.destroy(err => {
      if (err) {
        console.error('Failed to destroy session:', err);
      }
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      req.user = null;
      return res.redirect(redirectUrl);
    });
  }
};

const ensureAuth = catchAsyncErrors(async (req, res, next) => {
  let token;

  //console.log('req.cookies.token in auth.js middleware==', req.cookies.token, req.user);
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log('Please login to access this resource');
   // req.flash('error', 'Please login to access this resource');
   //destroySessionAndRedirect(req, res);
    return res.status(401).json({
    status: 'error',
    message: 'Please login to access this resource'
    });
  }

  try {
    const decodedData = jwt.decode(token);
    let secret;
   // console.log('decodedData in auth.js middleware==', decodedData);

    if (!decodedData) {
      req.user = null;
      req.flash('error', 'Invalid token. Please login again.');
      return destroySessionAndRedirect(req, res);
    }

    if (decodedData.type === 'emailVerification') {
      secret = process.env.EMAIL_VERIFICATION_SECRET;
    } else if (decodedData.type === 'auth') {
      secret = process.env.JWT_SECRET;
    } else {
      throw new Error('Invalid token type');
    }

    jwt.verify(token, secret, async (err, user) => {
      if (err) {
        req.flash('error', 'No user found');
        return destroySessionAndRedirect(req, res);
      }
      req.user = await User.findOne({ email: user.email });
      // console.log('verifiedData in auth.js middleware==', req.user);
      next();
    });

  } catch (error) {
    // console.error('Authentication Error:', error);
    if (error.name === 'TokenExpiredError') {
      req.flash('error', 'Your session has expired. Please log in again.');
    } else {
      req.flash('error', 'Failed to authenticate. Please try again.');
    }
    destroySessionAndRedirect(req, res);
  }
});

const checkSessionExpiration = (req, res, next) => {
  if (req.session) {
    const now = Date.now();
    const expirationTime = new Date(req.session.cookie.expires).getTime();
    if (now >= expirationTime) {
      req.user = null;
      req.flash('error', 'Your session has expired. Please log in again.');
      destroySessionAndRedirect(req, res);
    } else {
      next();
    }
  } else {
    next();
  }
};

module.exports = {
  ensureAuth,
  checkSessionExpiration,
  destroySessionAndRedirect,
};
