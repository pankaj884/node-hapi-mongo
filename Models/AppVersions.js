
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('../constant');

const AppVersions = new Schema({
    latestIOSVersion : {type: String, required:true},
    latestAndroidVersion : {type: String, required:true},
    criticalAndroidVersion : {type: String, required:true},
    criticalIOSVersion : {type: String, required:true},
    appType : {
        type : String,
        index:true, 
        unique:true, 
        enum : constant.APP_CONSTANTS.USER_CONSTANTS.userType.server
    },
    timeStamp: {type: Date, default: Date.now}
});


module.exports = mongoose.model('AppVersions', AppVersions);