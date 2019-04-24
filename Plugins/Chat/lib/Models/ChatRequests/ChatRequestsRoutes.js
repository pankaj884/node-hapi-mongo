var dependencies = require('../../../dependencies.js')

var routesModule = dependencies.routesModule;
var Controller = dependencies.Controller;
var UniversalFunctions = dependencies.UniversalFunctions;
var commonRoutes = dependencies.commonRoutes
var Joi = require('joi');

Controller.makeModule.chatRequests = require('./ChatRequestsController').chatRequests

var payload = {
maxBytes: 20000000,
parse: true,
output: 'file',
}

var schema = {
put: {

	_id : Joi.string(),
	name : Joi.string(),
	email : Joi.string(),
	phone : Joi.string(),
	subject : Joi.string(),
	message : Joi.string(),

},
post: {
	name : Joi.string(),
	email : Joi.string(),
	phone : Joi.string(),
	subject : Joi.string(),
	message : Joi.string(),

}
}


function ChatRequestsRoute(controller, requestSchema, mainKey, subKey , payload) {



// binding this controller with the controller in the p arent module i.e. routesModule
routesModule.call(this, controller, requestSchema, mainKey, subKey , payload);
}

ChatRequestsRoute.prototype = Object.create(routesModule.prototype) // inheritance happening


ChatRequestsRoute.prototype.getParentRoutes = ChatRequestsRoute.prototype.getRoutes;
//ChatRequestsRoute.prototype.overridedParantFunction = ChatRequestsRoute.prototype.ParantFunction;


ChatRequestsRoute.prototype.createSession = function(request, reply){


this.controller.add(request.payload, commonRoutes.handleControllerResponseWithoutAuth.bind({
reply: reply,
request: request
}));

}

ChatRequestsRoute.prototype.getRoutes = function(request, reply) {

var seperator = '';
if (this.apiName) {
seperator = '/'
}

var newRoutes =[ 

// You can write new routes here
// 

{
    method: 'POST',
    path: '/v1/' + this.apiName ,
    handler: this.createSession.bind(this),
    config: {
        validate: {
            payload: schema.post
        },
        description: 'get a module by its id',
        tags: ['api', this.moduleName],
        plugins: commonRoutes.routesPlugin
    }
}
]


return this.getParentRoutes().concat(newRoutes);
}

module.exports = {
'chatRequests': new ChatRequestsRoute(Controller.makeModule.chatRequests, schema, 'admins', 'chatRequests')
};