const express = require('express');

const router = express.Router();
const User = require('../models/user');


// set layout variables
router.use((req, res, next) => {
  res.locals.title = 'MakeReddit';
  res.locals.currentUserId = req.session.userId;

  next();
});

// home page
router.get('/', (req, res) => {
  res.render('index');
});

// login
router.get('/login', (req, res) => {
  res.render('login');
});

// post login
router.post('/login', (req, res, next) => {
// 1
// passing in the login form data and a callback
// (req represents the HTTP request object and form data lives in the body of those requests

// 2
// The callback ((err, user) => {...})
// becomes the next() function in UserSchema.statics.authenticate, defined in models/user.js.
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      /* eslint-disable-next-line */
      const next_error = new Error('Username or Password incorrect');
      next_error.status = 401;

      return next(next_error);
    }
    /* eslint-disable-next-line */
    req.session.userId = user._id;

    return res.redirect('/');
  });
});

module.exports = router;


// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }
  return res.redirect('/login');
});
