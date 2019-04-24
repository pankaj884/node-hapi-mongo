
module.exports = [
// {
//     name: 'example',
//     register: function (server, options) {

//         server.expose('key', 'value');
//         server.plugins.example.other = 'other';

//         console.log(server.plugins.example.key);      // 'value'
//         console.log(server.plugins.example.other);    // 'other'
//     }
// }
    // ,{register : require('./ApiHistoryPlugin')}

   require('./auth-token'),
    require('./swagger'),
    require('./ApiHistoryPlugin')
   // ,{ register: require('./good-console')}
   // ,{ register: require('./rateLimiter')}

   // ,{register : require('./bell')}
   // ,{register : require('./Authorization')}
   // ,{register : require('./ApiHistoryPlugin')}
   // ,{register : requirwe('./Migrations')}
   //,{register : require('./OrganisationsAuthentication')},

];
