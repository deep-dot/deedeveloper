
const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  status: {
    type: String,
    enum:['pending','active'],
    default: 'pending'
  },
  token: {
    type: String,
  },
  tokenExpires: {
    type: Date // Date type for storing the expiration timestamp
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  provider: {
    type: String,
  },
  displayName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'Driver'],
    default: 'User'
  },
  phone: { type: String, },
  country: { type: String, },
  city: { type: String, },
  hash: String,
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  notifications: {
    userid: String,
    title: String,
    content: String,
   // profileImage: String,
   // createdAt: String,
  },
})

UserSchema.plugin(uniqueValidator, { message: 'This {PATH} already existing.' });

// UserSchema.pre("save", function (next) {
//   const user = this
//   console.log('this.isModified("password")===',this.isModified("password"));
//   console.log('this.isNew===',this.isNew);
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (saltError, salt) {
//       if (saltError) {
//         return next(saltError)
//       } else {
//         bcrypt.hash(user.password, salt, function(hashError, hash) {
//           if (hashError) {
//             return next(hashError)
//           }
//           user.password = hash
//           next()
//         })
//       }
//     })
//   } else {
//     return next()
//   }
// });


UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(this.password, salt, 10000, 64, 'sha512').toString('hex');
    this.salt = salt;
    this.password = genHash;
    next();
  } else {
    return next();
  }
});

// //to get passport support
UserSchema.methods.validPassword = function (password) {
  var passwordVerify = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
  return this.password === passwordVerify;
}

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getJWTToken = function (type) {
  const payload = { email: this.email, type: type };

  let secret;
  let expiresIn;

  if (type === 'emailVerification') {
    secret = process.env.EMAIL_VERIFICATION_SECRET;
    expiresIn = `${parseInt(process.env.EMAIL_VERIFICATION_EXPIRE, 10)}m`; // Convert to string with 'm' for minutes
  } else if (type === 'auth') {
    secret = process.env.JWT_SECRET;
    expiresIn = `${parseInt(process.env.JWT_EXPIRE, 10)}m`; // Convert to string with 'm' for minutes
  } else {
    throw new Error('Invalid token type');
  }

  return jwt.sign(payload, secret, { expiresIn: expiresIn });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model('User', UserSchema)