'use strict';

const Config = require('../constant');
const async = require('async');
const apns = require('apn');
const gcm = require('node-gcm');
const config = require('config');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mg = require('nodemailer-mailgun-transport');
const isMailSendingAllowed = true;
const isMessageSendingAllowed = false;

function updateHandleBarVariables(data, callback) {
    data.message = renderMessageFromTemplateAndVariables(data.body, data.handlebarData);
    return callback(null, data);
}

const sendEmailToUser = function(data, callback) {
    const waterfallArray = [];

    waterfallArray.push(getEmailBodyFromDB.bind(null, data));
    waterfallArray.push(updateHandleBarVariables);
    waterfallArray.push(sendMailViaTransporter);

    async.waterfall(waterfallArray, callback)
}

function getEmailBodyFromDB(data, callback) {
    const UniversalFunctions = require('../Utils/UniversalFunctions');

    if (data.title) {
        let Service = require('../Services');

        data.body = UniversalFunctions.CONFIG.APP_CONSTANTS.emailNotificationMessages[data.title].emailMessage;
        data.subject = UniversalFunctions.CONFIG.APP_CONSTANTS.emailNotificationMessages[data.title].emailSubject;
        return callback(null, data);
    } else {
        return callback(null, data);
    }
}

function renderMessageFromTemplateAndVariables(templateData, variablesData) {
    const Handlebars = require('handlebars');
    if (!templateData) {
        templateData = "test";
    }
    return Handlebars.compile(templateData)(variablesData);
}

function sendMailViaTransporter(mailOptions, callback) {

    const auth = {
        auth: {
            api_key: 'apikey',
            domain: 'domain'
        }
    };

    mailOptions.from = "mailFrom";

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));


    nodemailerMailgun.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log('Error: ' + err);
            return callback(err);
        } else {
            return callback(null, info);
        }
    });
}

function sendTransporterEmail(subject, html, emailId) {

    let smtp = {
        "host": "host",
        "auth": {
            "user": "user",
            "pass": "password"
        },
        "port": 587,
    }

    const mailOptions = {
        to: emailId,
        subject: subject,
        html: html,
        from: "emailFrom"
    }

    const customTransporter = nodemailer.createTransport(smtpTransport(smtp));

    customTransporter.sendMail(mailOptions, function(error, info) {
        console.log('Mail Sent Callback Error sendTransporterEmail:', error);
        console.log('Mail Sent Callback Info sendTransporterEmail:', info);
    });
}

module.exports = {
    sendEmail: sendTransporterEmail,
    sendEmailToUser: sendEmailToUser,
};