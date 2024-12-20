// Import required modules
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const Session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const config = require('./config/config.js');
const env = process.env.NODE_ENV || 'development';
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// Initialize express app
const app = express();

// Passport Config
require('./config/passport')(passport);

// Session setup
app.use(Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: config.db_url[env] }),
  cookie: { 
    // secure: process.env.NODE_ENV === 'production',
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 15, // Session expiration time in milliseconds (e.g., 15 minutes)
   }
}));

// Middlewares setup
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// EJS setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/main');

// Middleware to set req.user if authenticated
app.use(async (req, res, next) => {  
  if (req.cookies && req.cookies.token) {    
    try {            
      const decodedData = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findOne({ email: decodedData.email });
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

// Flash messages and user info middleware
app.use((req, res, next) => {  
// console.log('req.user in app.js', req.user, req.flash());
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.data = req.flash('data');
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = !!req.user;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/reviews'));
app.use('/', require('./routes/comments'));
app.use('/', require('./routes/sendEmail'));

// API endpoints for React
app.get('/api/auth/status', (req, res) => {
  //console.log('in app js req user')
  res.json({ isAuthenticated: !!req.user, userImage: req.user ? req.user.image : null });
});

app.get('/api/auth/userDetail', (req, res) => {
  res.json({ userName: req.user ? req.user.username || req.user.displayName : null, userEmail: req.user ? req.user.email : null });
});

// Serving React build files for production
const staticFilesPath = path.join(__dirname, "..", "reactend", env === "production" ? "build" : "public");
app.use(express.static(staticFilesPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, "index.html"));
});

// Fallback for 404 Not Found
app.use((req, res) => res.status(404).render('pages/notfound.ejs'));

// Error handling middleware
//app.use(errorMiddleware);

module.exports = app;
