var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.chatSessions = new serviceModule(require('./ChatSessions'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function ChatSessionsController(service) {

 
//console.log('============================================ChatSessionsController controller initialised')
ControllerModule.call(this, service);
}

ChatSessionsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'chatSessions': new ChatSessionsController(Service.makeModule.chatSessions)
};