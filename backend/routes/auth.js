const express = require('express');
const passport = require('passport');
//const Session = require('express-session');
const router = express.Router();
const fetch = require('node-fetch');
// const { stringify } = require('querystring');
// const bcrypt = require('bcrypt')
const User = require('../models/User');
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { ensureAuth, ensureGuest } = require('../middleware/auth')
//const ErrorHander = require("../utils/errorhandler");
var jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

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
  //console.log('registerUser', req.body, req.file)
  if (req.file === "" || req.file === undefined || !req.file || req.file == null) {
    error = `Please select image`;
    req.flash('error', error);
    //res.json({ success: false, msg: "select image"});
    return res.redirect('/auth/newuser');
  }
  if (req.body['g-recaptcha-response'] === '') {
    await cloudinary.uploader.destroy(req.file.filename);
    error = `Please select captcha`;
    req.flash('error', error);
    // res.json({ success: false, msg: "Please select captcha"});
    return res.redirect('/auth/newuser');
  }
  const body = await fetch(`https://google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.CAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`,
  }).then(res => res.json());
  if (!body.success) {
    error = `Failed captcha verification`;
    req.flash('error', error);
    //res.json({ success: false, msg: "Failed captcha verification"});
    return res.redirect('/auth/newuser');
  }
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  //var paath = "/" + req.file.path.split('/').slice(1).join('/');
   console.log('token===', token);
   try{
  const user = await User.create({
    username: req.body.name,
    email: req.body.email,
    password: req.body.password,
    image: req.file.path,
    token
  });
} catch (err){console.error(err)};

  if (user) {
    sendToken(user, 200, res);
    success = `You are registered successfully! Please check ${req.body.email} and click link to verify it.`;
    req.flash('success', success);
    res.redirect('/auth/login');

    const verifyUserUrl = `${req.protocol}://${req.get("host")}/auth/verifyEmail/${user.token}`;
    // const verifyUserUrl = `${process.env.FRONTEND_URL}/auth/verifyEmail/${user.confirmationCode}`;
    sendEmail({
      email: user.email,
      subject: "Please confirm your account",
      html: `<div>
        <h1>Email Confirmation</h1>
          <h2>Hello ${user.username}</h2>
          <p>Please confirm your email by clicking on the following link</p>
          <a href=${verifyUserUrl}> Click here</a>
          </div>`,
    });
  } else {
    // return next(new ErrorHander("Registration unsuccessful", 400));
    error = `User with this email ${req.body.email} already exists`;
    req.flash('error', error);
    return res.redirect('/auth/newuser');
  }
}));

router.get('/newuser', (req, res) => {
  res.render('pages/auth/register.ejs', {
    style:'login.css',
    bodyId:'',
    sitekey: process.env.CAPTCHA_SITE_KEY,
    error: res.locals.error,
    success: res.locals.success
  });
})

router.get('/verifyEmail/:token', (req, res) => {
  var token = req.params.token;
  res.render('pages/auth/verifyEmail.ejs', {
    style:'login.css',
    bodyId:'verifyEmail',
    error: res.locals.error,
    success: res.locals.success,
    token
  })
})

router.post('/verifyEmail/:token', (req, res) => {
 // console.log('verifyEmail====', req.params.token)
  User.findOne({
    tokan: req.params.token,
  })
    .then((user) => {
      if (!user) {
        error = `User Not found.`;
        req.flash('error', error);
        return res.redirect(`/auth/verifyEmail/${req.params.token}`);
      }
      user.status = "active";
      //loggedIn = user;
      user.save((err) => {
        if (err) {
          error = err.message;
          req.flash('error', error);
          //res.status(500).json({ success: false, message: err.message });
          return;
        }
        success = `Welcome! ${user.username}  You are logged in now.`;
        req.flash('success', success);
        return res.redirect('/auth/profile');
      });
    })
    .catch((e) => console.log("error", e));
});

router.get('/profile', ensureAuth, (req, res) => {
  console.log('profile===', req.user)
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
    style:'login.css',
    bodyId:'profileId',
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

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    keepSessionInfo: true
  }), (req, res) => {
    sendToken(req.user, 200, res);
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  });

router.get('/login', (req, res) => {
  if (loggedIn) {
    res.redirect('/');
  } else {
    res.render('pages/auth/login.ejs', {
      style:'login.css',
      bodyId:'',
      sitekey: process.env.CAPTCHA_SITE_KEY,
      error: res.locals.error,
      success: res.locals.success
    })
  }
});

router.get('/passwordforgot', (req, res) => {
  res.render('pages/auth/forgotpassword/forgotpassword.ejs', {
    style:'login.css',
    bodyId:'passwordForget',
    error: res.locals.error,
    success: res.locals.success
  })
})

// forgot password
router.post('/password/forgot', async (req, res, next) => {
  console.log(req.body.email)
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    error = `User not found`;
    req.flash('error', error);
    return res.redirect('/auth/passwordforgot');
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/auth/password/reset/${resetToken}`;
  //const resetPasswordUrl = `${process.env.FRONTEND_URL}/auth/password/reset/${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message:`<div>
      <p>Your password reset token is </p>
      <a href=${resetPasswordUrl}>Click here</a>
      <p>If you have not requested this email then, please ignore it.</p>
      </div>`,      
    });
    success = `Email sent to ${user.email} successfully`;
    req.flash('success', success);
     res.send({ success: true })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    error = `Email can't be sent, please try again`;
    req.flash('error', error);
    res.send({ success: false })
    // return next(new ErrorHander(error.message, 500));
  }
});

router.get("/password/reset/:token", (req, res) => {
  var token = req.params.token;
  res.render('pages/auth/forgotpassword/resetpassword.ejs', {
    style:'login.css',
    bodyId:'',
    token,
    error: res.locals.error,
    success: res.locals.success
  })
});

// reset password
router.put("/password/reset/:token", async (req, res, next) => {
  console.log(req.params);
  //return res.json({success:false, msg:req.body.token});
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //return res.json({success:true, msg:resetPasswordToken});
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    // return res.json({success:true, message:'user not found'});
    error = `Reset Password Token is invalid or has been expired`;
    req.flash('error', error);
    return res.redirect(`/auth/password/reset/${req.params.token}`);
  }
  if (req.body.password != req.body.confirmpassword) {
    //console.log('password mismatch')
    // return res.json({success:true, message:'password mismatch'});
    error = `Password does not match`;
    req.flash('error', error);
    return res.redirect(`/auth/password/reset/${req.params.token}`);
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save((err) => {
    if (err) {
      //res.status(500).send({ message: err });
      req.flash('error', err);
      return;
    }
    sendToken(user, 200, res);
    success = `password updated successfully`;
    req.flash('success', success);
    return res.redirect('/auth/login');
  });
});

router.get('/logout', (req, res, next) => {
  //passport loggedOut  clears both the “req.session.passport” and the “req.user” 
  //e.g. "req.session.passport" -------> {}
  //"req.user" ------->  undefined
  //req.logOut();
  //express session destroy
  req.session.destroy();
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, '', {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  }
  res.redirect('/');
})

//delete
router.delete('/deleteUser/:id', ensureAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log("id in delete user",req.params.id);
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