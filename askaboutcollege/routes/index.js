const express = require('express');

const router = express.Router();
const User = require('../models/user');
const posts = require('./posts');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');

// home page
router.get('/', (req, res) => {
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      //res.render('rooms/index', { rooms }); // rooms: rooms
      res.render('index', { rooms });
    }
  });

});

// login
router.get('/login', (req, res) => {
  res.render('login');
});

//search
router.get('/search', (req, res) =>{
  res.redirect('/rooms');
});

//Search post
router.post('/search', (req, res) =>{
  console.log(req.body);
  res.status(204).send({});

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

    return res.redirect('/rooms');
  });
});

// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }
  return res.redirect('/login');
});

module.exports = router;
