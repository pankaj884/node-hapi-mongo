const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('../../constant');

const Testing = new Schema({

},{
    timestamps : true
});

module.exports = mongoose.model('Testing', Testing);