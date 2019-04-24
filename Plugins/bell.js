'use strict';
exports.register = function(server, options, next) {

  console.log("server.info.uri: ", server.info.uri);

  //Register Authorization Plugin
  server.register(require('bell'), function(err) {
    server.auth.strategy('facebook', 'bell', {
      provider: 'facebook',
      password: 'password',
      isSecure: false,
      // You'll need to go to https://developers.facebook.com/ and set up a
      // Website application to get started
      // Once you create your app, fill out Settings and set the App Domains
      // Under Settings >> Advanced, set the Valid OAuth redirect URIs to include http://<yourdomain.com>/bell/door
      // and enable Client OAuth Login
      clientId: '756517161079576',
      clientSecret: 'a5a495868c1aadd858fa91b5bd06fdaa'

    });

    server.auth.strategy('google', 'bell', {
      provider: 'google',
      password: 'password',
      isSecure: false,
      // You'll need to go to https://console.developers.google.com and set up an application to get started
      // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
      // Next, go to "APIs & auth >> Credentials and Create new Client ID
      // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
      // This will net you the clientId and the clientSecret needed.
      // Also be sure to pass the location as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
      // You must also enable the Google+ API in your profile.
      // Go to APIs & Auth, then APIs and under Social APIs click Google+ API and enable it.
      clientId: '823779402454-7n7gvtgsakit4249fv8h2rcfkkifokvv.apps.googleusercontent.com',
      clientSecret: 'Ap_IW08NSBIYQ9Shw-IhUsgk'
    });
  });


  next();
};


exports.register.attributes = {
  name: 'bell-modified'
};
