const express = require('express');

const router = express.Router();

const posts = require('./posts');


const auth = require('./helpers/auth');
const Room = require('../models/room');

const Post = require('../models/post');


// Rooms index
router.get('/', (req, res) => {
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms }); // rooms: rooms
    }
  });

});

// Rooms new
router.get('/new', auth.requireLogin, (req, res, next) => {

  res.render('rooms/new');
});

// Rooms show
/*router.get('/:id', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, function(err, room){
    if(err) {console.error(err); }


    Post.find ({ room: room }).sort ({ points: -1 }).populate ('comments').exec (function(err, posts){

      if(err){console.error(err)};

      res.render('rooms/show', { room: room, posts: posts});

    });
  });
});
*/

router.get('/:id', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id).populate('loginname').exec (function(err, room){
    if(err) {console.error(err); }
    
      // console.log('----------------------');
       //console.log(room.loginname.username);
      // console.log('----------------------');
      // console.log(room.loginname[1]);

    Post.find ({ room: room }).populate ('comments').exec (function(err, posts){

      if(err){console.error(err)};

      res.render('rooms/show', {room, posts});

    });
  });
});





// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res) => {

  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    res.render('rooms/edit', { room }); // room: room
  });

});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res, next) => {

  Room.findByIdAndUpdate(req.params.id, req.body,function(err, room) {
    if (err) { console.error(err); }

    res.redirect('/rooms/'+req.params.id)
  });



});
// Rooms create
router.post('/', auth.requireLogin, (req, res, next) => {
  console.log(req.userinfo);
  const room = new Room({
    topic: req.body.topic,
    loginname: req.session.userId
  });


  //console.log(req.session);
  //console.log(room.loginname);
  /*Post.find({ room: room}).populate('loginname').exec(function(err, rooms) {
    //console.log(req.session.userId);
    res.render('rooms/show',{room: room , posts: posts });
    // this internal code does not change
  });
  */
  room.save(function(err, room) {
    if(err) { console.error(err) };

    return res.redirect('/rooms');


  });
});

router.use('/:roomId/posts', posts);

module.exports = router;
