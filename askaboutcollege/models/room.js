const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
   topic : { type: String , required : true },
   loginname: { type :Schema.Types.ObjectId, ref:'User'}
   //loginname:{ type: String }
});

module.exports = mongoose.model('Room' , RoomSchema);
