const constant = require('../constant');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const async = require('async');
const Path = require('path');
const knox = require('knox');
const fsExtra = require('fs-extra');
const config = require('config');
const AWS = require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');

const digitalOceanRegion = config.get('digitalOceanRegion');
const digitalOceanAccessKeyId = config.get('digitalOceanAccessKeyId');
const digitalOceanSecretAccessKey = config.get('digitalOceanAccessKeyId');

function uploadImageFileToS3Bucket(file, folder, callback) {

    var fs = require('fs');

    var filename = constant.APP_CONSTANTS.DATABASE.profilePicPrefix.Original + getRandomInt(999999999) + file.filename; // actual filename of file
    var path = file.path;
    var mimeType = file.type;

    if (!mimeType) {
        mimeType = file.headers['content-type'];
    }

    fs.readFile(path, function(error, file_buffer) {

        if (error) {
            return callback(0);
        } else {

            var s3bucket = new AWS.S3({
                endpoint: spacesEndpoint,
                accessKeyId: digitalOceanAccessKeyId,
                secretAccessKey: digitalOceanSecretAccessKey,
                region: digitalOceanRegion
            });

            var params = {
                Bucket: "ctadg",
                Key: folder + '/' + filename,
                Body: file_buffer,
                ACL: 'public-read',
                ContentType: mimeType
            };

            s3bucket.putObject(params, function(err, data) {
                fs.unlink(path, function(err) {
                    if (err) console.log(err);
                });

                if (err) {
                    return callback(err);
                } else {
                    return callback(null, filename);
                }
            });
        }
    });
};
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    uploadImageFileToS3Bucket: uploadImageFileToS3Bucket
};