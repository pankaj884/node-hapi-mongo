var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.chatRequests = new serviceModule(require('./chatRequests'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function ChatRequestsController(service) {

 
//console.log('============================================ChatRequestsController controller initialised')
ControllerModule.call(this, service);
}

ChatRequestsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'chatRequests': new ChatRequestsController(Service.makeModule.chatRequests)
};