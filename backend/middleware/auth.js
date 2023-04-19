// module.exports = {
//   ensureAuth: function (req, res, next) {
//     req.session.returnTo = req.originalUrl;
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     return res.redirect('/auth/login')
//   },
//   ensureGuest: function (req, res, next) {
//     if (!req.isAuthenticated()) {
//       return next();
//     } else {
//       return res.redirect('/');
//     }
//   },
// }


const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  ensureAuth: catchAsyncErrors(async(req, res, next) => {
    const token  = req.cookies.token;
    //console.log('token in middleware===', token, req.cookies.token);
    if (!token || token === undefined) {
      error = `Please Login to access this resource`;
      console.log(error)
      req.flash('error', error);
      return res.redirect('/auth/login');
      //return next(new ErrorHander("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decodedData);
    req.user = await User.findById(decodedData.id);
    //console.log('token in middleware===', req.user);
    next();
  }
  )
}