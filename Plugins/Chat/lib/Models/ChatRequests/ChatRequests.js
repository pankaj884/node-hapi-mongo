var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Constants = require('../../constants.js');
// {type: [Number , String , Date] , trim: true, required: true, unique: true , default: Date.now}


var ChatRequests = new Schema({
	name : {type : String },
	email : {type : String },
	phone : {type : String },
	subject : {type : String },
	message : {type : String },
	status : {type: String, trim: true, required: true, enum:[
			Constants.CHAT_STATUS.PENDING,
			Constants.CHAT_STATUS.ONGOING,
			Constants.CHAT_STATUS.ENDED,
		], default: Constants.CHAT_STATUS.PENDING},
   chatSessionsId : { type: Schema.ObjectId, ref: 'ChatSessions'  }
},{
timestamps : true
});

module.exports = mongoose.model('ChatRequests', ChatRequests);
