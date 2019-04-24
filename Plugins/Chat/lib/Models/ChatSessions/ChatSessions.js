var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');


var messageSchema = new Schema({
	message : {type : String},
	senderId : {type : String}

})



var ChatSessions = new Schema({

  firstUserModel : {type : String},
  firstUserId: { type: Schema.ObjectId, refPath: 'firstUserModel' },
  receiverModel : {type : String},
  secondUserId: { type: Schema.ObjectId, refPath: 'secondUserModel' },
  users : [{
  	userModel : {type : String},
  	userId: { type: Schema.ObjectId, refPath: 'users.userModel' }
  }
  ],
  messages : [messageSchema]

},{
timestamps : true
});



ChatSessions.index({ firstUserId: 1, secondUserId: 1 }, { unique: true });


module.exports = mongoose.model('ChatSessions', ChatSessions);
