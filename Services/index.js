const Models = require('../Models');
const serviceModule = require('./ServiceModule').ServiceModule;
const makeModule = {
    'emailTemplates': Models.EmailTemplates,
    'accessTokens': Models.AccessTokens,
    'users': Models.Users,
    'increment': Models.Increment,
    's3file': Models.S3file,
    'admin': Models.Admin
,'testing' : Models.Testing
}

const objectToExport = {
    AppVersionService: require('./AppVersionService'),
    makeModule: {},
};


for (key in makeModule) {
    objectToExport.makeModule[key] = new serviceModule(makeModule[key]);
}


module.exports = objectToExport;