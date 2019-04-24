var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.chatSessions = require('./ChatSessionsController').apiPaths


var payload = {
maxBytes: 20000000,
parse: true,
output: 'file',
}

var schema = {
put: {

},
post: {

}
}


function ChatSessionsRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

ChatSessionsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ChatSessionsRoute.prototype.getParentRoutes = ChatSessionsRoute.prototype.getRoutes;
//ChatSessionsRoute.prototype.overridedParantFunction = ChatSessionsRoute.prototype.ParantFunction;


ChatSessionsRoute.prototype.newFunction = function(request, reply){


this.controller.anyController(request.params.id, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}

ChatSessionsRoute.prototype.getRoutes = function(request, reply) {

var seperator = '';
if (this.apiName) {
seperator = '/'
}

var newRoutes =[ 

// You can write new routes here
// 

// {
//     method: 'GET',
//     path: '/v1/' + this.apiName ,
//     handler: this.newFunction.bind(this),
//     config: {
//         validate: {
//             query: {
//             }

//         },
//         description: 'get a module by its id',
//         tags: ['api', this.moduleName],
//         plugins: commonRoutes.routesPlugin
//     }
// }



]


return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
'chatSessions': new ChatSessionsRoute(Controller.makeModule.chatSessions, schema, 'admins', 'chatSessions')
};