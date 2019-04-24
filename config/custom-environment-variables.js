/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    "ENV": "NODE_ENV",
    "JWT_SECRET_KEY": "JWT_SECRET_KEY",
    "HAPI_PORT": "PORT",
    "webGoogle": {
        "secret": "WEB_GOOGLE_SECRET"
    },
    "webFb": {
        "secret": "WEB_FB_SECRET"
    },
    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    // models: {
    //   connection: 'someMongodbServer'
    // }

};
