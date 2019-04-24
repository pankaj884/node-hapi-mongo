const Service = require('../../Services');
const Models = require('../../Models');
const ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const controllerHelper = require('../../Controllers/commonControllerFunctions');
const Config = require('../../constant');

function IncrementController(service) {
   ControllerModule.call(this, service);
}

IncrementController.prototype = Object.create(ControllerModule.prototype)

module.exports = {
   'increment': new IncrementController(Service.makeModule.increment)
};;