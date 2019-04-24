const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constant = require('../../constant');
const lastMod = require('../lastModPlugin');

const AccessTokens = new Schema({
    referal: {
        kind: { type: String },
        referId: { type: Schema.ObjectId, refPath: 'referal.kind' }
    },
    userId: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    accessToken: { type: String, index: true, unique: true, required: true },
}, {
    timestamps: true
});


module.exports = mongoose.model('AccessTokens', AccessTokens);
