var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.accessControlList = new serviceModule(require('./AccessControlList'));

function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function AccessControlListController(service) {

 
//console.log('============================================AccessControlListController controller initialised')
ControllerModule.call(this, service);
}

AccessControlListController.prototype = Object.create(ControllerModule.prototype)




module.exports = {
'accessControlList': new AccessControlListController(Service.makeModule.accessControlList)
};