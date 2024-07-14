const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
// const LocalStrategy = require('passport-local').Strategy;
// const fetch = require('node-fetch')
const config = require('./config.js');
const env = process.env.NODE_ENV || 'development';
const User = require('../models/User')
// const sendToken = require("../utils/jwtToken");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: config.google_url[env],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('config.google_url[env]==', config.google_url[env])
        var newUser = new User();
        newUser.Id = profile.id,
          newUser.provider = profile.provider;
        newUser.displayName = profile.displayName;
        newUser.firstName = profile.name.givenName;
        newUser.lastName = profile.name.familyName;
        newUser.image = profile.photos[0].value;
        newUser.email = profile.emails[0].value;
        newUser.password = " ";
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user)
          }
          //newUser.save();
          newUser.save().then(function (err, result) {
            //console.log('User Created');
          });
          done(null, newUser)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: config.fb_url[env],
    profileFields: ['id', 'displayName', 'name', ['photos'], ['email']]
  },
    async (accessToken, refreshToken, profile, done) => {

      var newUser = new User();
      newUser.Id = profile.id,
        newUser.provider = profile.provider;
      newUser.displayName = profile.displayName;
      newUser.firstName = profile.name.givenName;
      newUser.lastName = profile.name.familyName;
      newUser.image = profile.photos[0].value;
      newUser.email = profile.emails[0].value;
      newUser.password = " ";
      try {
        let user = await User.findOne({ email: profile.emails[0].value })
        if (user) {
          return done(null, user)
        }
        newUser.save().then(function (err, result) {
          // console.log('User Created');
        });
        done(null, newUser)
      } catch (err) {
        return done(err, false)
      }
    }
  ));

  // passport.use(new LocalStrategy({
  //     usernameField: 'email',
  //     passReqToCallback: true
  //   },
  //   async (req, email, password, done) => {
  //     try {

  //       if (req.body['g-recaptcha-response'] === '') {
  //         return done(null, false, req.flash('error', 'Please select captcha'));
  //       }
  
  //       const recaptchaResponse = await fetch(`https://google.com/recaptcha/api/siteverify`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: `secret=${process.env.CAPTCHA_SECRET}&response=${req.body['g-recaptcha-response']}`,
  //       }).then(res => res.json());
  
  //       if (!recaptchaResponse.success) {
  //         return done(null, false, req.flash('error', 'Failed captcha verification'));
  //       }
  
  //       const user = await User.findOne({ email }).exec();
  //       if (!user) {
  //         return done(null, false, req.flash('error', 'Incorrect email'));
  //       }
  
  //       const isPasswordMatched = user.validPassword(password);
  //       if (!isPasswordMatched) {
  //         return done(null, false, req.flash('error', 'Incorrect password'));
  //       }
  
  //       if (user.status === "pending") {
  //         const error = `Pending Account. A link was sent to ${user.email} when you signed up.
  //         Please check it and click the link to verify your account!`;
  //         return done(null, false, req.flash('error', error));
  //       }        
  //       return done(null, user);
  //     } catch (err) {
  //       // Handle unexpected errors gracefully
  //       return done(err);
  //     }
  //   }
  // ));
  

  passport.serializeUser((user, done) => {
    done(null, user._id)
    // Passport will pass the authenticated_user to serializeUser as "user" 
    // This is the USER object from the done() in auth function
    // Now attach using done (null, user.id) tie this user to the req.session.passport.user = {id: user.id}, 
    // so that it is tied to the session object
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, '-password -salt', (err, user) => done(err, user))
    // This is the id that is saved in req.session.passport.{ user: "id"} during the serialization
    // use the id to find the user in the DB and get the user object with user details
    // pass the USER object in the done() of the de-serializer
    // this USER object is attached to the "req.user", and can be used anywhere in the App.

    //Notice when we query the database to retrieve the user object by its _id, we used the field options argument (the dash) to tell Mongoose to skip the password and salt fields, which is also a good security practice.
  })
}

// redirecting the authenticated user to their profile page.
// res.redirect('/~' + req.user.username);