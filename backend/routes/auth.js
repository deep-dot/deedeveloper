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
const { destroySessionAndRedirect } = require('../middleware/auth');
const bcrypt = require('bcrypt')

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

  const { email, password, 'g-recaptcha-response': captchaResponse } = req.body;
  // const { name, email, password } = req.body;
  // const captchaResponse = req.body['g-recaptcha-response'];
  console.log('auth.js registerUser==', captchaResponse);

  // Verify CAPTCHA
  if (!captchaResponse) {
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (e) {
        console.log("Failed to delete image from Cloudinary:", e);
      }
    }
    return res.status(400).json({ success: false, message: 'Please complete the CAPTCHA' });
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaResponse}`;

  try {
    const captchaVerification = await fetch(verificationUrl, { method: 'POST' });
    const captchaResult = await captchaVerification.json();

    if (!captchaResult.success) {
      return res.status(400).json({ success: false, message: 'CAPTCHA verification failed' });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `User with this email ${req.body.email} already exists.`
      });
    }

    const imagePath = req.file ? req.file.path : '';

    const newUser = new User({
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      image: imagePath,
    });
    const { token, tokenExpires } = sendToken(newUser, 200, res, 'emailVerification');
    newUser.token = token;
    newUser.tokenExpires = tokenExpires;
    await newUser.save();

    const baseProtocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
    const verifyUserUrl = `${baseProtocol}://${req.get("host")}/auth/verifyEmail/${token}`;

    await sendEmail({
      email: newUser.email,
      subject: "Please confirm your account",
      message: `<div><h1>Email Confirmation</h1><h2>Hello ${newUser.username}</h2>
                <p>Please confirm your email by clicking on the following link</p>
                <a href=${verifyUserUrl}> Click here</a></div>`,
    });

    res.status(200).json({
      success: true,
      message: `You are registered successfully! Please check ${newUser.email} and click the link to verify it.`
    });
  } catch (err) {
    console.error("Registration error", err.message);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again."
    });
  }
}));


router.get('/newuser', (req, res) => {
  res.render('pages/auth/register.ejs', {
    style: 'login.css',
    bodyId: 'registrationPage',
    sitekey: process.env.CAPTCHA_SITE_KEY
  });
})

router.get('/verifyEmail/:token', (req, res) => {
  const token = req.params.token;
  res.render('pages/auth/verifyEmail.ejs', {
    style: 'login.css',
    bodyId: 'verifyEmail',
    token
  });
});
router.post('/verifyEmail/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    // Activate user and clear token
    user.status = 'active';
    user.token = undefined;
    user.tokenExpires = undefined;
    await user.save();

    sendToken(user, 200, res, 'auth'); // assign user in req.user

    // Log the user in
    req.login(user, (err) => {
      if (err) {
        console.error('Login error', err);
        return res.status(500).json({ success: false, message: 'Failed to log in.' });
      }

      res.status(200).json({ success: true, message: `Welcome! ${user.username}, you are logged in now.` });
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'An error occurred during verification. Please try again.' });
  }
});



router.get('/profile', ensureAuth, (req, res) => {
  res.render('pages/profile.ejs', {
    style: 'login.css',
    bodyId: 'profileId',
    name: req.user?.username || req.user?.displayName || '',
    email: req.user?.email || '',
    status: req.user?.status || '',
    id: req.user?._id || '',
    image: req.user?.image || '',
    role: req.user?.role || ''
  });
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    keepSessionInfo: true
  }), (req, res) => {
    // console.log('req.user in routes/auth/google/callback', req.user, req.sessionID)
    sendToken(req.user, 200, res, 'auth', req.sessionID);
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  });

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'profile'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/login',
    keepSessionInfo: true
  }), (req, res) => {
    sendToken(req.user, 200, res, 'auth', req.sessionID);
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


router.get('/login', (req, res) => {
  res.render('pages/auth/login.ejs', {
    style: 'login.css',
    bodyId: 'loginPage',
    sitekey: process.env.CAPTCHA_SITE_KEY,
  });
});

router.post('/login', async (req, res) => {
  const { email, password, 'g-recaptcha-response': captchaResponse } = req.body;

  // Check if captcha response exists
  if (!captchaResponse) {
    return res.status(400).json({ success: false, message: 'Please complete the CAPTCHA' });
  }

  // Verify captcha with Google
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaResponse}`;

  try {
    const captchaVerificationResponse = await fetch(verificationUrl, { method: 'POST' });
    const captchaResult = await captchaVerificationResponse.json();

    if (!captchaResult.success) {
      return res.status(400).json({ success: false, message: 'Failed CAPTCHA verification' });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ success: false, message: 'This email is not registered or incorrect email' });
    }

    const isPasswordMatched = user.validPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    if (user.status === "pending") {
      const currentTime = Date.now();
      if (user.tokenExpires > currentTime) {
        return res.status(401).json({ success: false, message: `Pending Account. A link was sent to ${user.email}. Please verify your account.` });
      } else {
        const { token, tokenExpires } = sendToken(user, 200, res, 'emailVerification');
        user.token = token;
        user.tokenExpires = tokenExpires;
        await user.save();

        const baseProtocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
        const verifyUserUrl = `${baseProtocol}://${req.get("host")}/auth/verifyEmail/${token}`;

        await sendEmail({
          email: user.email,
          subject: "Please confirm your account",
          message: `<div><h1>Email Confirmation</h1><h2>Hello ${user.username}</h2>
                    <p>Please confirm your email by clicking on the following link</p>
                    <a href=${verifyUserUrl}> Click here</a></div>`,
        });

        return res.status(401).json({ success: false, message: 'A new verification email has been sent. Please check your email.' });
      }
    }

    sendToken(user, 200, res, 'auth', req.sessionID);
    user.status = "active";
    user.token = undefined;
    user.tokenExpires = undefined;

    await user.save();

  //  console.log('login route in auth.js req.session.returnTo == ', req.session.returnTo);
     // Handle redirect back to the stored URL or default route
     const redirectUrl = req.session.returnTo || '/';
     delete req.session.returnTo; // Clear the returnTo URL from the session
 
     return res.json({ success: true, message: 'Logged in successfully.', redirectUrl });

  } catch (err) {
    res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
  }
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
    bodyId: 'passwordForget'
  })
})

router.post('/password/forgot', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/auth/password/reset/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Recovery',
      message: `<div>
                <p>Your password reset token is </p>
                <a href=${resetPasswordUrl}>Click here</a>
                <p>If you have not requested this email, please ignore it.</p>
                </div>`,
    });

    res.json({ success: true, message: `Email sent to ${user.email} successfully` });
  } catch (error) {
    console.error('Failed to send the password reset email:', error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({ success: false, message: "Email can't be sent, please try again" });
  }
});



router.get("/password/reset/:token", (req, res) => {
  var token = req.params.token;
  res.render('pages/auth/forgotpassword/resetpassword.ejs', {
    style: 'login.css',
    bodyId: 'passwordReset',
    token,
  })
});

router.put("/password/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    // Validate password match upfront
    if (password !== confirmpassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset Password Token is invalid or has expired' });
    }

    // Update user password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: 'An error occurred while updating the password. Please try again.' });
  }
});

router.get('/logout', (req, res) => {
  destroySessionAndRedirect(req, res);
});

router.delete('/deleteUser/:id', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("id in delete user", req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.image) {
      const imageUrl = user.image;
      await cloudinary.uploader.destroy(imageUrl);
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user. Please try again.",
    });
  }
});


module.exports = router