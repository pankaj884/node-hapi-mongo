var dependencies = require('../../../dependencies.js')

var Service = dependencies.Service;
var Models = dependencies.Models;
var ControllerModule = dependencies.ControllerModule;
var UniversalFunctions = dependencies.UniversalFunctions;
var controllerHelper = dependencies.controllerHelper;
var Config = dependencies.Config;
var serviceModule = dependencies.ServiceModule;

Service.makeModule.migrations = new serviceModule(require('./migrations'));


function startSection(sectionName) {

console.log('=====================' + sectionName + '===================')
}


function MigrationsController(service) {

 
//console.log('============================================MigrationsController controller initialised')
ControllerModule.call(this, service);
}

MigrationsController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
'migrations': new MigrationsController(Service.makeModule.migrations)
};