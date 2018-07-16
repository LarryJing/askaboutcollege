const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema({

username: { type: String, required: true },
password: { type: String, required: true }
});

// pre method takes a call back
UserSchema.pre('save',function(next){
let user= this;


// call the hash function and crypt the password
bcrypt.hash(user.password,10 , function (err, hash){
  if(err) return next(err);

  user.password=hash;
next();

})

});


//User authenticate
//authenticate() when users send us their password,
//which happens when they submit the login form
UserSchema.statics.authenticate = function(username, password, next) {
  User.findOne({ username: username })
    .exec(function (err, user){
      if(err){
        return next(err)
      }
    else if(!user){
      var err= new Error('User not found.');
      err.status = 401;
      return next(err);
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if(result === true){
        return next(null, user);
      }
    else{
      next();
    }
  });
});


}
const User = mongoose.model('User', UserSchema);

module.exports = User;
