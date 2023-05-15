
// Import required modules
const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const app = express();
const path = require('path');
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const Session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport')(passport);
const errorMiddleware = require("./middleware/error");

// Global variable for logged-in user
global.loggedIn = '';

// Set up session

const config = require('./config/config.js');
const env = process.env.NODE_ENV || 'development';
app.use(
  Session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: config.db_url[env] }),
  })
);

// Set up method override for handling PUT and DELETE requests
app.use(
  methodOverride('_method', (req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }),
);

// Set up view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/main');

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

// Set up static files
app.use(express.static(path.join(__dirname, './public')));

// Set up flash middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.data = req.flash('data');
  res.locals.user = req.user || null;
  loggedIn = req.user || null;
  next();
});

// Set up cookie parser
app.use(cookieParser());

// Set up JSON and URL-encoded body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/reviews'));
app.use('/', require('./routes/comments'));
app.use('/', require('./routes/sendEmail'));

// Set up serving React build files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "reactend", "build"))); 
}
app.get("/quote", (req, res) => {  
  console.log('quote btn is clicked')
  res.sendFile(path.join(__dirname, "..", "reactend", "build", "index.html"));
});

app.use((req, res) => res.render('pages/notfound.ejs', {
  style: '',
  bodyId: 'PageNotFound',
}));

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;














