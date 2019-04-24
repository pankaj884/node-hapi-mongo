const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constant = require('../../constant');
const lastMod = require('../lastModPlugin');

const Increment = new Schema({
    moduleType: { type: String, required: true },
    count: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
},{
    timestamps : 	true
});


module.exports = mongoose.model('Increment', Increment);