'use strict';

const mongoose = require('mongoose');
const constant = require('../constant');
const Service = require('../Services');
const async = require('async');
const Models = require('../Models');
const config = require('config');
mongoose.Promise = global.Promise;

const dbConfig = config.get('mongoUri');

mongoose.connect(dbConfig, { useMongoClient: true }, function(err) {
    if (err) {
        console.log('***** mongoose err **************', err);
        process.exit(1);
    } else {
        console.log('***** mongoose success **************');
    }
});

exports.bootstrapAdmin = function(callback) {

    var adminData2 = {
        email: 'admin@admin.in',
        password: '14e1b600b1fd579f47433b88e8d85291',
        name: 'imu'
    };
    var adminData3 = {
        email: 'admin@admin.com',
        password: '14e1b600b1fd579f47433b88e8d85291',
        name: 'imu'
    };
    async.parallel([
        function(cb) {
            insertData(adminData2.email, adminData2, cb)
        },
        function(cb) {
            insertData(adminData3.email, adminData3, cb)
        }
    ], function(err, done) {
        callback(err, 'Bootstrapping finished');
    })
};

function insertData(email, adminData, callback) {
    var needToCreate = true;
    async.series([function(cb) {
        var criteria = {
            email: email
        };
        Service.makeModule.admins.view(criteria, {}, {}, function(err, data) {
            if (data && data.length > 0) {
                needToCreate = false;
                constant.APP_CONSTANTS.ADMIN_ACCESS_TOKEN = data[0].accessToken;
            }
            cb()
        })
    }, function(cb) {
        if (needToCreate) {
            Service.makeModule.admins.add(adminData, function(err, data) {
                cb(err, data)
            })
        } else {
            cb();
        }
    }], function(err, data) {

        callback(err, 'Bootstrapping finished')
    })
}


exports.createApiPaths = function(pathArr) {

    const criteria = {};
    const options = { upsert: true }

    createSuperDuperAdminRole(function(err, result) {

        pathArr.forEach(function(route) {

            if (Service.makeModule.apiPaths) {
                Service.makeModule.apiPaths.edit({ method: route.method, path: route.path }, { method: route.method, path: route.path }, options, function(err, result) {});
            }
        });
    })
}


exports.createOrgApiPaths = function(pathArr) {

    var criteria = {};
    var options = { upsert: true }


    createSuperDuperAdminRole(function(err, result) {

        pathArr.forEach(function(route) {

            if (Service.makeModule.apiPaths) {
                Service.makeModule.orgAuthApis.edit({ method: route.method, path: route.path, name: route.method + ":" + route.path }, { method: route.method, path: route.path }, options, function(err, result) {})
            }
        });
    })
}

const crudPermission = ['READ', 'ADD', 'EDIT', 'DELETE']

exports.createPermissionsForEachRole = function createPermissionsForEachRole() {

    if (Service.makeModule.roles) {
        Service.makeModule.roles.view({}, {}, {}, function(err, result) {

            result.forEach(function(role) {

                Object.keys(Service.makeModule).forEach(function(model) {

                    crudPermission.forEach(function(operation) {

                        Service.makeModule.accessControlList.edit({ roleId: role._id, model: model, isAllow: false, permission: operation }, { roleId: role._id, model: model, permission: operation }, { upsert: true, new: true }, function(err, result) {})
                    })
                })
            })
        })
    }
}

function createSuperDuperAdminRole(callback) {
    if (Service.makeModule.roles) {
        Service.makeModule.roles.edit({ name: "SUPER_ADMIN" }, { name: "SUPER_ADMIN" }, { upsert: true, new: true }, callback);
    }
}

function createNewAdminConstant() {
    Service.makeModule.adminConstants.add({}, {}, {}, function(err, result) {});
}