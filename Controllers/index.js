const ControllerModule = require('./ControllerModule').ControllerModule;
const Service = require('../Services');

const objectToExport = {
    makeModule: {}
};


for (key in Service.makeModule) {
    objectToExport.makeModule[key] = new ControllerModule(Service.makeModule[key]);
}

objectToExport.makeModule['accessTokens'] = require('../Models/AccessTokens/AccessTokensController').accessTokens;
objectToExport.makeModule['users'] = require('../Models/Users/UsersController').users;
objectToExport.makeModule['increment'] = require('../Models/Increment/IncrementController').increment;
objectToExport.makeModule['s3file'] = require('../Models/S3file/S3fileController').s3file;
objectToExport.makeModule['admin'] = require('../Models/Admin/AdminController').admin;

objectToExport.makeModule['testing'] = require('../Models/Testing/TestingController').testing;
module.exports = objectToExport;