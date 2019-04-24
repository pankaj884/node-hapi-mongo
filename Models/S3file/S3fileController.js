const Service = require('../../Services');
const Models = require('../../Models');
const ControllerModule = require('../../Controllers/ControllerModule').ControllerModule;
const UniversalFunctions = require('../../Utils/UniversalFunctions');
const controllerHelper = require('../../Controllers/commonControllerFunctions');
const Config = require('../../constant');


function startSection(sectionName) {

   console.log('=====================' + sectionName + '===================')
}


function S3fileController(service) {

 
   //console.log('============================================S3fileController controller initialised')
   ControllerModule.call(this, service);
}

S3fileController.prototype = Object.create(ControllerModule.prototype)


module.exports = {
   's3file': new S3fileController(Service.makeModule.s3file)
};;