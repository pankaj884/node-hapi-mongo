const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constant = require('../../constant');

const lastMod = require('../lastModPlugin');

const template = new Schema({
	title: {type: String, trim: true, required: true, unique: true},
    subject: {type: String, trim: true, required: true},
    body: {type: String, trim: true, required: true},
    senderEmail: {type: String, trim: true, required: true},
    handlebarVars: [{type: String, trim: true}],
    lastUpdated: {type: Date, default: Date.now, required: true},
},{
    timestamps : true
});


module.exports = mongoose.model('EmailTemplates', template);