const express = require('express');
const passport = require('passport');
const Session = require('express-session');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../models/User');
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { ensureAuth, ensureGuest, checkSessionExpiration } = require('../middleware/auth')
//const ErrorHander = require("../utils/errorhandler");
var jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const {destroySessionAndRedirect} =  require('../middleware/auth');

const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, ('./public/img/db_img'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);

//   }
// });


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "AOPRegisterUser",
    allowedFormats: ["jpg", "png", "jpeg", "svg"]
  },
});
const fileFilter = (req, file, cb) => {
  //console.log('file==', file);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('image');

router.post('/registerUser', upload, catchAsyncErrors(async (req, res) => {
  if (req.body['g-recaptcha-response'] === '') {
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (e) {
        console.log("Failed to delete image from Cloudinary:", e);
        // Consider additional error handling here, if necessary
      }
    }

    req.flash('error', 'Please complete the captcha.');
    return res.redirect('/auth/newuser');
  }
  const captchaVerificationResponse = await fetch(`https://google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.CAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`,
  }).then(res => res.json());

  if (!captchaVerificationResponse.success) {
    req.flash('error', 'Failed captcha verification.');
    return res.redirect('/auth/newuser');
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {      
      // Check if the request is an AJAX request
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(409).json({
          success: false,
          message: `User with this email ${req.body.email} already exists.`
        });
      } 
      req.flash('error', `User with this email ${req.body.email} already exists.`);
      return res.redirect('/auth/newuser');
    }

    const imagePath = req.file ? req.file.path : '';

    const newUser = new User({
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: imagePath,
    });
   // const token = newUser.getJWTToken('emailVerification'); 
    const token = sendToken(newUser, 200, res,'emailVerification' );
    console.log('token in register user', token);
    newUser.token = undefined; 
    await newUser.save(); 

    const baseProtocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
    const verifyUserUrl = `${baseProtocol}://${req.get("host")}/auth/verifyEmail/${token}`;
    //console.log('verify url in register user===', verifyUserUrl)
    await sendEmail({
      email: newUser.email,
      subject: "Please confirm your account",
      message: `<div>
        <h1>Email Confirmation</h1>
        <h2>Hello ${newUser.username}</h2>
        <p>Please confirm your email by clicking on the following link</p>
        <a href=${verifyUserUrl}> Click here</a>
        </div>`,
    });

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(200).json({
        success: true,
        message: `You are registered successfully! Please check ${newUser.email} and click the link to verify it.`
      });
    } 
    req.flash('success', `You are registered successfully! Please check ${newUser.email} and click the link to verify it.`);
    res.redirect('/auth/login');
  } catch (err) {
    console.error("Registration error", err.message);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({
        success: false,
       // message: "An error occurred during registration. Please try again."
       message: err.message
      });
    } 
    req.flash('error', 'An error occurred during registration. Please try again.');
    res.redirect('/auth/newuser');
  }
}));

router.get('/newuser', (req, res) => {
  res.render('pages/auth/register.ejs', {
    style: 'login.css',
    bodyId: '',
    sitekey: process.env.CAPTCHA_SITE_KEY,
    error: res.locals.error,
    success: res.locals.success
  });
})

router.get('/verifyEmail/:token', (req, res) => {
  var token = req.params.token;
  res.render('pages/auth/verifyEmail.ejs', {
    style: 'login.css',
    bodyId: 'verifyEmail',
    error: res.locals.error,
    success: res.locals.success,
    token
  })
});

router.post('/verifyEmail/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      status: 'pending' // only search for users with 'pending' status
    });

    if (!user || !bcrypt.compareSync(token, user.token)) {
      req.flash('error', 'Invalid or expired token.');
      return res.redirect('/auth/verifyEmail');
    }

    user.status = 'active';
    user.token = undefined; // remove the token after verification

    await user.save();

    req.login(user, (err) => {
      if (err) {
        console.log('Login error', err);
        req.flash('error', 'Failed to log in');
        return res.redirect('/auth/login');
      }

      req.flash('success', `Welcome! ${user.username}, you are logged in now.`);
      return res.redirect('/auth/profile');
    });
  } catch (e) {
    console.log('error', e);
    req.flash('error', e.message);
    return res.redirect('/auth/verifyEmail');
  }
});

router.get('/profile', ensureAuth, (req, res) => {
  //console.log('profile===', req.user)
  let name = "";
  let email = "";
  let status = "";
  let id = "";
  let image = "";
  let role = "";

  if (req.user) {
    name = req.user.username || req.user.displayName;
    email = req.user.email;
    status = req.user.status;
    id = req.user._id;
    image = req.user.image;
    role = req.user.role;
  }
  res.render('pages/profile.ejs', {
    style: 'login.css',
    bodyId: 'profileId',
    name,
    email,
    status,
    id,
    image,
    role,
  })
})

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    keepSessionInfo: true
  }), (req, res) => {
    sendToken(req.user, 200, res);
    // req.session.returnTo = req.originalUrl;
    // console.log(req.session.returnTo); // doesnt have returnTo inside anymore ?
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  });

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'profile'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/login',
    keepSessionInfo: true
  }), (req, res) => {
    sendToken(req.user, 200, res);
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  });

// router.post('/login',
//   passport.authenticate('local', {
//     failureRedirect: '/auth/login',
//     keepSessionInfo: true
//   }), (req, res) => {    
//     sendToken(req.user, 200, res, 'auth', req.sessionID);
//     const expiresAt = parseInt(process.env.JWT_EXPIRE, 10) * 60 * 1000;
//     req.flash('success', `Logged in successfully. Your session will expire on ${expiresAt}.`);
//     res.redirect(req.session.returnTo || '/');
//     delete req.session.returnTo;
// });

router.post('/login', async(req, res) => {   
  // console.log('req body in auth login==', req.body)
  const {email, password} = req.body;
  try {

    if (req.body['g-recaptcha-response'] === '') {
      req.flash('error', 'Please select captcha');
      return res.redirect('/auth/login');
    }

    const recaptchaResponse = await fetch(`https://google.com/recaptcha/api/siteverify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.CAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`,
    }).then(res => res.json());

    if (!recaptchaResponse.success) {
      req.flash('error', 'Failed captcha verification');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      req.flash('error', 'Incorrect email');
      return res.redirect('/auth/login');
    }

    const isPasswordMatched = user.validPassword(password);
    if (!isPasswordMatched) {
      req.flash('error', 'Incorrect password');
      return res.redirect('/auth/login');
    }

    if (user.status === "pending") {
      const error = `Pending Account. A link was sent to ${user.email} when you signed up.
      Please check it and click the link to verify your account!`;
      req.flash('error', error);
      return res.redirect('/auth/login');
    }        
    console.log('user in auth login==', user);
  
    sendToken(user, 200, res, 'auth', req.sessionID);
    const expiresAt = parseInt(process.env.JWT_EXPIRE, 10) * 60 * 1000;
    req.flash('success', `Logged in successfully. Your session will expire in ${expiresAt / 60000} minutes.`);
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  } catch (err) {
    console.log(err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/auth/login');
  }    
});

router.get('/login', (req, res) => {
    res.render('pages/auth/login.ejs', {
      style: 'login.css',
      bodyId: '',
      sitekey: process.env.CAPTCHA_SITE_KEY,
      error: res.locals.error,
      success: res.locals.success
    })
});

router.post('/extend-session', ensureAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user logged in' });
    }

    // Reissue the token and update the cookie
    const { token, tokenExpires } = sendToken(req.user, 200, res, 'auth', req.sessionID);

    res.json({ token, tokenExpires });
  } catch (error) {
    console.error('Error extending session:', error);
    res.status(500).json({ message: 'Failed to extend session' });
  }
});

router.get('/passwordforgot', (req, res) => {
  res.render('pages/auth/forgotpassword/forgotpassword.ejs', {
    style: 'login.css',
    bodyId: 'passwordForget',
    error: res.locals.error,
    success: res.locals.success
  })
})

// forgot password
router.post('/password/forgot', async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });
  //console.log('password forgot user ==', user);
  if (!user) {
    req.flash('error', 'User not found');
    return res.redirect('/auth/passwordforgot');
  }

  const resetToken = user.getResetPasswordToken();
  //console.log('password forgot==', resetToken);
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/auth/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Recovery',
      message: `<div>
              <p>Your password reset token is </p>
              <a href=${resetPasswordUrl}>Click here</a>
              <p>If you have not requested this email then, please ignore it.</p>
              </div>`,
    });
    req.flash('success', `Email sent to ${user.email} successfully`);
    res.send({ success: true });
  } catch (error) {
    console.error('Failed to send the password reset email:', error);

    // Reset token information should be cleared if the email sending fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    req.flash('error', 'Email can\'t be sent, please try again');
    res.send({ success: false });
  }
});


router.get("/password/reset/:token", (req, res) => {
  var token = req.params.token;
  res.render('pages/auth/forgotpassword/resetpassword.ejs', {
    style: 'login.css',
    bodyId: '',
    token,
    error: res.locals.error,
    success: res.locals.success
  })
});

// reset password
router.put("/password/reset/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    // Validate password match upfront
    if (password !== confirmpassword) {
      req.flash('error', 'Password does not match');
      return res.redirect(`/auth/password/reset/${token}`);
    }

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the token and ensure the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      req.flash('error', 'Reset Password Token is invalid or has expired');
      return res.redirect(`/auth/password/reset/${token}`);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    req.flash('success', 'Password updated successfully');
    res.redirect('/auth/login');
  } catch (error) {
    console.error("Error resetting password:", error);
    req.flash('error', 'An error occurred while updating the password. Please try again.');
    res.redirect(`/auth/password/reset/${req.params.token}`);
  }
});

router.get('/logout', (req, res) => {
  destroySessionAndRedirect(req, res);
});

//delete
router.delete('/deleteUser/:id', ensureAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log("id in delete user", req.params.id);
  if (user.image) {
    const imageUrl = user.image;
    await cloudinary.uploader.destroy(imageUrl);
  }
  await user.remove();
  // res.status(200).json({
  //   success: true,
  //   message: "User Deleted Successfully",
  // });
  success = `Profile deleted successfully`;
  req.flash('success', success);
  return res.redirect('/auth/newuser');
})

module.exports = router