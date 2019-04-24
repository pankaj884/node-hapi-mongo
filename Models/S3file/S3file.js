const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constant = require('../../constant');
const lastMod = require('../lastModPlugin');

const S3file = new Schema({
    url: { type: String, required: true },
    tag: { type: String, required: true },
    userId: {
        type: Schema.ObjectId,
        ref: 'Users',
    },
    isDeleted: { type: Boolean, default: false, required: true },
}, {
    timestamps: true
});


module.exports = mongoose.model('S3file', S3file);