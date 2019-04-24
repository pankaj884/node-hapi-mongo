const fs = require('fs');
const models = ["testing"]
const Types = {
    string: "string",
    number: "number",
    boolean: "boolean"
};
const modelData = {}
const Handlebars = require('handlebars')
const baseDir = './Models';
const baseDirForPlugin = './Plugins/Chat/lib/Models';
const testCaseDir = "./specs/modelsTesting";

let dir = "";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}



models.forEach(function(model) {
    dir = baseDir + '/' + model.capitalize();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    createModelFolder(model);
    createModel(model);
    createController(model);
    createRoute(model);
    createTestCase(model);
    appendModelInIndex(model);
    appendServiceInIndex(model);
    appendRouteInIndex(model);
    appendControllerInIndex(model);

});


function createModelFolder(model) {
    var dir = baseDir + '/' + model.capitalize();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function appendModelInIndex(model) {

    const filepath = "./Models/index.js";
    const source = fs.readFileSync(filepath, 'utf8')
    const modelPath = "./" + model.capitalize() + "/" + model.capitalize() + "";
    const pathTobeAppend = "\n, '" + model.capitalize() + "' : require('" + modelPath + "')\n";

    if (source.indexOf(modelPath) == -1) {
        const position = source.match(/\n};/);
        console.log(position.index);
        const output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, output)
    }
}

function appendServiceInIndex(model) {

    const filepath = "./Services/index.js";
    const source = fs.readFileSync(filepath, 'utf8')
    const modelPath = "./" + model.capitalize() + "/" + model.capitalize() + ")";
    const pathTobeAppend = ",'" + model + "' : Models." + model.capitalize() + "\n";

    if (source.indexOf(model + "' : Models." + model.capitalize()) == -1) {
        
        const position = source.match(/.*}.*\n*.*\n*.*const objectToExport/);
        console.log(position.index);
        const output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, output)
    }
}

function appendControllerInIndex(model) {

    const filepath = "./Controllers/index.js";
    const source = fs.readFileSync(filepath, 'utf8')
    const controllerPath = "./../Models/" + model.capitalize() + "/" + model.capitalize() + "Controller"
    const pathTobeAppend = "objectToExport.makeModule['" + model + "'] = require('../Models/" + model.capitalize() + "/" + model.capitalize() + "Controller')." + model + ";\n";

    if (source.indexOf("objectToExport.makeModule['" + model + "']") == -1) {
       
        const position = source.match(/module\.exports = objectToExport;/);
        console.log(position.index);
        const output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, output)
    }
}


function appendRouteInIndex(model) {

    const filepath = "./Routes/index.js";
    const source = fs.readFileSync(filepath, 'utf8')
    const routePath = "./../Models/" + model.capitalize() + "/" + model.capitalize() + "Routes"
    const pathTobeAppend = "else if (key == '" + model + "') {" + "\n" +
        " makeModule[key] = require('" + routePath + "')." + model + ";" + "\n" +
        "}\n";

    if (source.indexOf(routePath) == -1) {
        const position = source.match(/if \(makeModule\[key\]/);
        // const position = source.match(/all.*=.*all\.concat\(makeModule\[key\]\.getRoutes\(\)\)\;/);
        console.log(position.index);
        const output = [source.slice(0, position.index), pathTobeAppend, source.slice(position.index)].join('');
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, output)
    }


}

function createService(model) {
    const filepath = dir + '/' + model.capitalize() + 'Service.js';
    if (!fs.existsSync(filepath)) {
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fs.openSync(filepath, 'w'));
    }
}

function createService(model) {
    const filepath = dir + '/' + model.capitalize() + 'Service.js';
    if (!fs.existsSync(filepath)) {
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fs.openSync(filepath, 'w'));
    }
}



function createController(model) {

    const filepath = dir + '/' + model.capitalize() + 'Controller.js';
    if (!fs.existsSync(filepath)) {
        const fd = fs.openSync(filepath, 'w');

        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, getControllerOverridingData(model))
    }

}

function createTestCase(model) {

    const filepath = testCaseDir + '/' + model.capitalize() + 'ModuleTest.js';
    if (!fs.existsSync(filepath)) {
        const fd = fs.openSync(filepath, 'w');

        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, getTestcaseOverridingData(model))
    }

}

function createRoute(model) {

    const filepath = dir + '/' + model.capitalize() + 'Routes.js';
    if (!fs.existsSync(filepath)) {
        const fd = fs.openSync(filepath, 'w');

        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, getRouteOverridingData(model))
    }

}


function createModel(model) {

    const filepath = dir + '/' + model.capitalize() + '.js';
    if (!fs.existsSync(filepath)) {
        const fd = fs.openSync(filepath, 'w');

        fs.closeSync(fs.openSync(filepath, 'w'));
        fs.writeFileSync(filepath, getModelOverridingData(model))
    }

}


function getModelOverridingData(model) {

    const source = fs.readFileSync('./OverridingModule/templates/modelTemplate', 'utf8');


    const data = {
        MODEL_NAME_CAP: model.capitalize(),
        MODEL_NAME: model
    }
    const finalResult = Handlebars.compile(source)(data);

    return finalResult;
}

function getControllerOverridingData(model) {


    const source = fs.readFileSync('./OverridingModule/templates/ControllerTemplate', 'utf8');


    const data = {
        CONTROLLER_NAME: model.capitalize() + "Controller",
        MODEL_NAME: model
    }
    const finalResult = Handlebars.compile(source)(data);

    return finalResult;

}

function getTestcaseOverridingData(model) {

    const source = fs.readFileSync('./OverridingModule/templates/testCaseTemplate', 'utf8');
    const data = {
        MODEL_NAME_CAP: model.capitalize(),
        MODEL_NAME: model
    }
    const finalResult = Handlebars.compile(source)(data);
    return finalResult;
}

function getRouteOverridingData(model) {

    const source = fs.readFileSync('./OverridingModule/templates/routeTemplate', 'utf8');
    const data = {
        ROUTE_NAME: model.capitalize() + "Route",
        MODEL_NAME: model
    }
    const finalResult = Handlebars.compile(source)(data);
    return finalResult;

}
