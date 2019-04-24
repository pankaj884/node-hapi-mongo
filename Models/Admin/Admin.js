const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('../../constant');
const lastMod = require('../lastModPlugin');
const Admin = new Schema({

    name: { type: String, trim: true, },
    countryCode: { type: String, required: false, trim: true, min: 2, max: 5, default: '91' },
    phone: { type: String, required: false, trim: true, min: 10, max: 15 },
    status: {
        type: String,
        enum: [
            constant.APP_CONSTANTS.DATABASE.userStatus.active,
            constant.APP_CONSTANTS.DATABASE.userStatus.pending,
            constant.APP_CONSTANTS.DATABASE.userStatus.hold,
            constant.APP_CONSTANTS.DATABASE.userStatus.declined
        ],
        default: constant.APP_CONSTANTS.DATABASE.userStatus.pending,
    },
    email: { type: String, trim: true, index: true, required: false },
    password: { type: String },
    otherCredentials: {
        googleId: { type: String, trim: true, index: true, sparse: true },
        facebookId: { type: String, trim: true, index: true, sparse: true }
    },
    passwordResetToken: { type: String, trim: true,index:true},
    otpCode: { type: String, trim: true},
    emailVerificationToken: { type: String, trim: true, index: true, },
    isBlocked: { type: Boolean,default: false,},
    isDeleted: { type: Boolean, default: false, required: true },
    emailVerified: { type: Boolean, default: false, required: true },
    phoneVerified: { type: Boolean, default: false, required: true },
    lastLogin: { type: Date, default: Date.now() },
    address: {
        street: { type: String, trim: true, default: "" },
        state: { type: String, trim: true, default: "" },
        city: { type: String, trim: true, default: "" },
        country: { type: String, trim: true, default: "" },
        pin: { type: String, trim: true, default: null },
        location: { type: [Number], default: [0, 0] },
    }
},{
    timestamps : true
});


module.exports = mongoose.model('Admin', Admin);