var chai = require('chai');
var request = require('supertest');
var _ = require('underscore');


chai.config.includeStack = true;

var userData = {
    email : "test1820@fakeEmail.com",
    password : "ASHUashu11",
    accessToken : ""
}

var adminData = {
    email : "ashu.saini1111@gmail.com",
    password : "123456",
    accessToken : ""
}

var vendorData = {

}

function log(){

    console.log.apply(null , arguments);
}

var testServer = "http://52.42.99.94:7007";
var testLocal = 'http://localhost:7077';


var server = testLocal

function json(verb, url) {
    console.log("------------hitting on url:  "+testLocal+ url)
    return request(testLocal)[verb](url)

    .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
}

global._ = _;

if (server == testLocal) {

    global.account = {
        email: "1455611903876@gmail.com",
        password: "123456"
    }
} else {
    global.account = {
        email: "ashu@gmail.com",
        password: "ASHUashu11"
    }

}


global.userData = userData
global.adminData = adminData;

fs = require('fs');

function saveTofile(fileName, dataToSave) {

    fs.writeFileSync(__dirname + "\\" + fileName + '.json', JSON.stringify(dataToSave), 'utf-8');

    console.log("done in dir : = > " + __dirname)
    console.log(__filename);
    // fs.writeFile( __dirname+"\\"+ fileName+'.json',JSON.stringify( data), function (err) {
    //   if (err) return console.log(err);



    // });
}


function random(max) {
    return Math.floor((Math.random(new Date()) * max) );
}

var fs = require('fs');

var testImages = fs.readdirSync('./testImages');
var testVideos = fs.readdirSync('./testVideos');

console.log(testVideos)
console.log(random(testVideos.length))

// function readFiles(dirname) {
//   fs.readdirSync(dirname)
// }

// readFiles('./testImages');


function getRandomImage() {
    return './testImages/'+testImages[random(testImages.length - 1)]
}


function getRandomVideos() {
  return './testVideos/'+testVideos[random(testVideos.length - 1)]
}


function readJSONFromFile(filename) {
    var obj = JSON.parse(fs.readFileSync(filename + '.json', 'utf8'));
    return obj;
}

global.readJSONFromFile = readJSONFromFile;

global.saveTofile = saveTofile;

global.getRandomImage = getRandomImage;
global.getRandomVideos = getRandomVideos;
global.random = random;

global.json = json;
global.log = log;
global.request = request;
// global.common = require('../commonTestingData');
global.getData = {

}
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;

global.vendorData = vendorData;
