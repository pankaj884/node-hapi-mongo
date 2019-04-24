const Service = require('../../Services');
const Models = require('../../Models');
const ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const controllerHelper = require('../../Controllers/commonControllerFunctions');
const Config = require('../../constant');

function TestingController(service) {
   ControllerModule.call(this, service);
}

TestingController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
   'testing': new TestingController(Service.makeModule.testing)
};;