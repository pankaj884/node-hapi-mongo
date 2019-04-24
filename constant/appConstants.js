 'use strict';

 const ADMIN_ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4YTMzODk4NmE4NmVlNDg4MjA1NTRmNyIsImRldmljZVRva2VuIjoiYXMiLCJkZXZpY2VUeXBlIjoiSU9TIiwiZGV2aWNlSWQiOiJhc2RhZCIsInR5cGUiOiJVU0VSIiwidGltZSI6MTQ4NzE3MDY4NDc1MCwiaWF0IjoxNDg3MTcwNjg0fQ.8XBPjzTYm6pWoDpG15Lowo7bSjbT4eLnzqokvqrJfiM";

 const env = {
     DEV: 'DEV',
     LIVE: 'LIVE',
     LOCAL: 'LOCAL'
 }
 const objectKeys = function(obj) {
     return Object.keys(obj);
 }

 const objectValues = function(obj) {
     const ar = [];
     Object.values(obj).forEach(function(k) {
         ar.push(obj[k]);
     });
     return ar;
 }


 const SERVER = {
     APP_NAME: 'APP_NAME',
     TOKEN_EXPIRATION_IN_MINUTES: 600,
     THUMB_WIDTH: 100,
     THUMB_HEIGHT: 100,
     DEBUGGING: false,
 };


 const POST_IMAGE_SIZE = {
     width: 630,
 }

 const PAGE_LIMIT = {
     NOTIFICATION: 5,
     USER_FILTER: 10,
     BOOKING_HISTORY: 20,
     DEFAULT_LIMIT: 50
 }

 const NOTIFICATIONS = {
     TYPE: {
         BOOKING: "booking"
     },
     PUSH: {
         NEW_BOOKING: {
             FLAG: 100,
             MESSAGE: "New Booking Received."
         },
         BOOKING_RESCHEDULE: {
             FLAG: 101,
             MESSAGE: "Booking has been rescheduled by the patient."
         },
         BOOKING_REMINDER: {
             FLAG: 102,
             MESSAGE: "You have a booking in a while. Check the details here!"
         }
     }

 }

 const WEB_VIEW_TITLE = {

 }

 const DATABASE = {
     USER_ROLES: {
         ADMIN: 'ADMIN',
         USER: 'USER',
         VENDOR: 'VENDOR'
     },
     userStatus: {
         active: 'ACTIVE',
         pending: 'PENDING',
         hold: 'HOLD',
         declined: 'DECLINED',
     },
     deviceType: {
         IOS: 'ios',
         Android: 'android',
         Website: 'web'
     },
     permissions: {
         None: "none",
         Read: "read",
         Add: "add",
         Edit: "edit",
         Delete: "delete"
     },
     profilePicPrefix: {
         Original: 'original_',
         Thumb: 'thumb_'
     },
     logoPrefix: {
         Original: 'logo_',
         Thumb: 'logoThumb_'
     },
     socketConstants: {
         NewNotification: "new-notification",
         AdminNotification: "admin-notification",
         NewMessage: "new-message",
         NewFileMessage: "new-file-msg"
     },
     mediaTypes: {
         File: "file",
         Image: "image",
         Video: "video",
         Audio: "audio"
     },

     subscriptionStatus: {
         Active: "Active",
         Unsubscribed: "Unsubscribed"
     },
 }

 const STATUS_MSG = {

     ERROR: {
         customError: function(message) {
             return {
                 statusCode: 400,
                 success: false,
                 type: 'CUSTOM_ERROR',
                 customMessage: message
             }
         },
         NOT_AUTHENTICATED_FACEBOOK_USER: {


         },
         ACCOUNT_NOT_APPROVED: {
             statusCode: 400,
             success: false,
             type: 'INVALID_ACCOUNT',
             customMessage: 'Your account has not been Approved Yet!'
         },
         EMAIL_NOT_VERIFIED: {
             statusCode: 400,
             success: false,
             type: 'EMAIL_NOT_VERIFIED',
             customMessage: 'Your account is not verified yet. Please verify your email id to continue with us.'
         },
         NOT_AUTHORIZED_TO_PERFORM_THIS_REQUEST: {
             statusCode: 400,
             success: false,
             type: 'NOT_AUTHORIZED_TO_PERFORM_THIS_REQUEST',
             customMessage: 'You are not authorized to perfom this request.'
         },
         REVEIW_OF_UNDEFINED: {
             statusCode: 400,
             success: false,
             type: 'REVEIW_OF_UNDEFINED',
             customMessage: 'Please send the review entity!'
         },
         NOT_ASSOCIATED_WITH_US: {
             statusCode: 400,
             success: false,
             type: 'NOT_ASSOCIATED_WITH_US',
             customMessage: 'User is not associated with ' + SERVER.APP_NAME + ' anymore. please contact support!'
         },
         SLUG_TITLE_ALREADY_EXIST: {
             statusCode: 400,
             success: false,
             type: 'SLUG_TITLE_ALREADY_EXIST',
             customMessage: 'Slug title already exist!'
         },
         INVALID_ID_PROVIDED: {
             statusCode: 400,
             success: false,
             type: 'INVALID_ID_PROVIDED',
             customMessage: 'Unable to delete! Invalid Id provided'
         },
         INVALID_CONSTANT_TYPE: {
             statusCode: 400,
             success: false,
             type: 'INVALID_CONSTANT_TYPE',
             customMessage: 'Invalid Constant Type'
         },

         CUSTOM_ERROR: {
             statusCode: 400,
             success: false,
             type: 'CUSTOM_ERROR',
             customMessage: 'CUSTOM_ERROR'
         },
         INVALID_PINCODE_ID: {
             statusCode: 400,
             success: false,
             type: 'INVALID_PINCODE_ID',
             customMessage: 'Invalid pincode id'
         },

         REQUEST_NOT_FOUND: {
             statusCode: 400,
             success: false,
             type: 'REQUEST_NOT_FOUND',
             customMessage: 'Invalid request there is no entity related to it'
         },
         INVALID_DELETION: {
             statusCode: 400,
             success: false,
             type: 'INVALID_DELETION',
             customMessage: 'Invalid deletion there is an entity related to it'
         },
         ACCOUNT_BLOCKED: {
             statusCode: 400,
             success: false,
             type: 'ACCOUNT_BLOCKED',
             customMessage: 'Your account has been blocked by Admin.'
         },
         INVALID_USER_PASS: {
             statusCode: 400,
             success: false,
             type: 'INVALID_USER_PASS',
             customMessage: 'Invalid username or password'
         },
         TOKEN_ALREADY_EXPIRED: {
             statusCode: 401,
             success: false,
             customMessage: 'Token Already Expired',
             type: 'TOKEN_ALREADY_EXPIRED'
         },

         DB_ERROR: {
             statusCode: 400,
             success: false,
             customMessage: "Sorry , It's not you .\n It's Us.",
             type: 'DB_ERROR'
         },
         INVALID_ID: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Id Provided : ',
             type: 'INVALID_ID'
         },
         APP_ERROR: {
             statusCode: 400,
             success: false,
             customMessage: 'Application Error',
             type: 'APP_ERROR'
         },

         IMP_ERROR: {
             statusCode: 500,
             success: false,
             customMessage: 'Implementation Error',
             type: 'IMP_ERROR'
         },

         INVALID_TOKEN: {
             statusCode: 401,
             customMessage: 'Invalid token provided',
             type: 'INVALID_TOKEN'
         },
         INVALID_CODE: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Verification Code',
             type: 'INVALID_CODE'
         },
         DEFAULT: {
             statusCode: 400,
             success: false,
             customMessage: 'Error',
             type: 'DEFAULT'
         },
         PHONE_NO_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No Already Exist',
             type: 'PHONE_NO_EXIST'
         },
         EMAIL_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Email Already Exist',
             type: 'EMAIL_EXIST'
         },

         INVALID_COUNTRY_CODE: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Country Code, Should be in the format +52',
             type: 'INVALID_COUNTRY_CODE'
         },
         INVALID_PHONE_NO_FORMAT: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone no. cannot start with 0',
             type: 'INVALID_PHONE_NO_FORMAT'
         },
         COUNTRY_CODE_MISSING: {
             statusCode: 400,
             success: false,
             customMessage: 'You forgot to enter the country code',
             type: 'COUNTRY_CODE_MISSING'
         },
         INVALID_PHONE_NO: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No. & Country Code does not match to which the OTP was sent',
             type: 'INVALID_PHONE_NO'
         },

         NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Document Not Found',
             type: 'NOT_FOUND'
         },
         INVALID_RESET_PASSWORD_TOKEN: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Reset Password Token',
             type: 'INVALID_RESET_PASSWORD_TOKEN'
         },
         INCORRECT_PASSWORD: {
             statusCode: 400,
             customMessage: 'Incorrect Password.',
             type: 'INCORRECT_PASSWORD'
         },

         SAME_PASSWORD: {
             statusCode: 400,
             success: false,
             customMessage: 'Old password and new password are same',
             type: 'SAME_PASSWORD'
         },

         ALREADY_EXIST_IN_DB: {
             statusCode: 400,
             success: false,
             customMessage: `Already exist in database.`,
             type: 'ALREADY_EXIST_IN_DB'
         },

         NOT_EXIST_IN_DB: {
             statusCode: 400,
             success: false,
             customMessage: `Not exist in database.`,
             type: 'NOT_EXIST_IN_DB'
         },

         EMAIL_ALREADY_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Email Address Already Exists',
             type: 'EMAIL_ALREADY_EXIST'
         },

         ERROR_PROFILE_PIC_UPLOAD: {
             statusCode: 400,
             success: false,
             customMessage: 'Error occured in Profile Pic upload.',
             type: 'ERROR_PROFILE_PIC_UPLOAD'
         },
         PHONE_ALREADY_EXIST: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No. Already Exists',
             type: 'PHONE_ALREADY_EXIST'
         },
         INVALID_JSON: {
             statusCode: 400,
             success: false,
             customMessage: 'Invalid Json Format.',
             type: 'INVALID_JSON'
         },
         EMAIL_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'You are not registered with us.',
             type: 'EMAIL_NOT_FOUND'
         },
         DATA_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Data not found in database. please contact support!',
             type: 'DATA_NOT_FOUND'
         },

         FACEBOOK_ID_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Facebook Id Not Found',
             type: 'FACEBOOK_ID_NOT_FOUND'
         },
         PHONE_NOT_FOUND: {
             statusCode: 400,
             success: false,
             customMessage: 'Phone No. Not Found',
             type: 'PHONE_NOT_FOUND'
         },
         INCORRECT_OLD_PASS: {
             statusCode: 400,
             success: false,
             customMessage: 'Incorrect Old Password',
             type: 'INCORRECT_OLD_PASS'
         },
         UNAUTHORIZED: {
             statusCode: 401,
             success: false,
             customMessage: 'Please login to continue.',
             type: 'UNAUTHORIZED'
         },
         UNAUTHORIZED_ACCESS: {
             statusCode: 400,
             success: false,
             customMessage: 'Please login to continue.',
             type: 'UNAUTHORIZED_ACCESS'
         },


         CANT_DELETE: {
             statusCode: 400,
             success: false,
             type: 'CANT_DELETE',
             customMessage: 'This booking cannot be deleted now.'
         },
         CANT_EDIT: {
             statusCode: 400,
             success: false,
             type: 'CANT_EDIT',
             customMessage: 'This booking cannot be edited now.'
         },
         NO_SERVICE: {
             statusCode: 400,
             success: false,
             type: 'NO_SERVICE',
             customMessage: 'We are not providing services in your area right now.'
         },

         SERVER_ERROR: {
             statusCode: 400,
             success: false,
             type: 'SERVER_ERROR',
             customMessage: 'There is some error at server side. Will fix this soon.'
         },
         NO_FILE_FOUND: {
             statusCode: 400,
             success: false,
             type: 'NO_FILE_FOUND',
             customMessage: "File not found.."
         },
         RECORD_NOT_FOUND: {
             statusCode: 400,
             success: false,
             type: 'RECORD_NOT_FOUND',
             customMessage: "Record not found."
         },
         CANT_FIND: {
             statusCode: 400,
             success: false,
             type: 'CANT_FIND',
             customMessage: "User not found."
         }
     },
     SUCCESS: {

         PLEASE_ENTER_OTP: {
             statusCode: 201,
             success: true,
             customMessage: 'Please verify your phone number. Your otp has been sent to your registered number.',
             type: 'PLEASE_ENTER_OTP'
         },

         PHONE_NOT_FOUND: {
             statusCode: 210,
             success: true,
             customMessage: 'Please provide your Phone Number.',
             type: 'PHONE_NOT_FOUND'
         },

         PHONE_NOT_VERIFIED: {
             statusCode: 212,
             success: true,
             customMessage: 'Please provide your Phone Number.Your phone is not verified yet.',
             type: 'PHONE_NOT_VERIFIED'
         },
         PHONE_ALREADY_VERIFIED: {
             statusCode: 213,
             success: true,
             customMessage: 'Your phone number is already verified for this booking. Proceed to confirm.',
             type: 'PHONE_ALREADY_VERIFIED'
         },
         CREATED: {
             success: true,
             statusCode: 201,
             customMessage: 'Created Successfully',
             type: 'CREATED'
         },
         RESET_TOKEN_SENT: {
             success: true,
             statusCode: 200,
             customMessage: 'Reset Email Sent Successfully, Please check your mail.',
             type: 'RESET_TOKEN_SENT'
         },
         DEFAULT: {
             success: true,
             statusCode: 200,
             customMessage: 'Success',
             type: 'DEFAULT'
         },
         UPDATED: {
             success: true,
             statusCode: 200,
             customMessage: 'Updated Successfully',
             type: 'UPDATED'
         },
         LOGOUT: {
             success: true,
             statusCode: 200,
             customMessage: 'Logged Out Successfully',
             type: 'LOGOUT'
         },
         DELETED: {
             success: true,
             statusCode: 200,
             customMessage: 'Deleted Successfully',
             type: 'DELETED'
         },
     }
 }

 const swaggerDefaultResponseMessages = [{
     code: 200,
     message: 'OK'
 }, {
     code: 400,
     message: 'Bad Request'
 }, {
     code: 401,
     message: 'Unauthorized'
 }, {
     code: 404,
     message: 'Data Not Found'
 }, {
     code: 500,
     message: 'Internal Server Error'
 }];


 const smsNotificationMessages = {
     verificationCodeMsg: 'Hi, Your 4 digit verification code for ' + SERVER.APP_NAME + ' is {{verificationCode}}.',
     userRegisterMsg: 'Hi {{userName}}, Thanks for registering with ' + SERVER.APP_NAME + '. You may call at 1800-3000-4243 for any further assistance.'
 }

 const emailNotificationMessages = {
     registrationEmail: {
         emailMessage: "Dear {{user_name}}, <br><br> Please  <a href='{{verification_url}}'>click here</a> to verify your email address",
         emailSubject: "Welcome to " + SERVER.APP_NAME
     },
     forgotPassword: {
         emailMessage: "Hi {{user_name}},<br><br>We have received a request to reset the password for your account.<br><br>If you made this request, please click on the link below or paste this into your browser to complete the process<br><br>{{password_reset_link}}<br><br>This link will work for 1 hour or until your password is reset.<br><br>If you did not ask to change your password, please ignore this email and your account will remain unchanged.<br><br><br>Thanks,<br>Team " + SERVER.APP_NAME + "!<br/>",
         emailSubject: "Reset your password"
     },
 };

 const languageSpecificMessages = {
     verificationCodeMsg: {
         EN: 'Your 4 digit verification code for Eiya Wallet is {{four_digit_verification_code}}',
         ES_MX: 'Los 4 dígitos de verificación para Eiya Wallet son {{four_digit_verification_code}}'
     }
 };

 const APP_CONSTANTS = {
     SERVER: SERVER,
     DATABASE: DATABASE,
     PAGE_LIMIT: PAGE_LIMIT,
     STATUS_MSG: STATUS_MSG,
     emailNotificationMessages: emailNotificationMessages,
     languageSpecificMessages: languageSpecificMessages,
     swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
     smsNotificationMessages: smsNotificationMessages,
     ADMIN_ACCESS_TOKEN: ADMIN_ACCESS_TOKEN,
     NOTIFICATIONS: NOTIFICATIONS
 };

 module.exports = APP_CONSTANTS;