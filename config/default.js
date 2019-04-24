const dir = __dirname;
const base = dir.split('/config')[0];

module.exports = {
    mongoUri: "mongodb://localhost:27017/database_name",
    defaultUrl: {},
    THUMB_HEIGHT: 100,
    THUMB_WIDTH: 100,
    digitalOceanRegion:'digitalOceanRegion',
    digitalOceanAccessKeyId:'digitalOceanAccessKeyId',
    digitalOceanSecretAccessKey:'digitalOceanSecretAccessKey',
    webGoogle: {
        peopleApiUrl: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
        accessTokenUrl: 'https://accounts.google.com/o/oauth2/token'
    },
    webFb: {
        accessTokenUrl: 'https://graph.facebook.com/v2.5/oauth/access_token',
        graphApiUrl: 'https://graph.facebook.com/v2.5/me?fields='
    },
    mobileGoogle: {
        verificationUrl: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
    }
};
