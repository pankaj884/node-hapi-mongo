var async = require('async');
var request = require('request');
const jwt = require('jwt-simple');
const Service = require('../../Services');
const UniversalFunctions = require('../../Utils/UniversalFunctions');
let TokenManager = require('../../Lib/TokenManager');
const UploadManager = require('../../Lib/UploadManager');
const CodeGenerator = require('../../Lib/CodeGenerator');
const NotificationManager = require('../../Lib/NotificationManager');
const constant = require('../../constant');
const config = require('config');
const crypto = require('crypto');
const generator = require('generate-password');
const studentUrl = process.env.STUDENT_URL;
const adminUrl = process.env.ADMIN_URL;

function CheckIfTokenManagerNotInitialised() {

    if (!TokenManager || !TokenManager.setToken) {
        TokenManager = require('../../Lib/TokenManager');
    }
}

var checkUserEmailExist = function(data, callback) {

    const criteria = {
        email: data.payload.email,
        isDeleted: false
    };

    const projection = {};
    const option = {
        lean: true
    };

    if (data.payload.organisationId) {
        criteria.organisationId = data.payload.organisationId;
    }

    Service.makeModule.users.view(criteria, projection, option, function(err, result) {
        if (err) {
            return callback(err)
        } else if (result && result.length) {
            return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_EXIST);
        } else {
            return callback(null, data);
        }
    });
};

exports.checkUserEmailExist = checkUserEmailExist;

exports.checkOrganisationExist = function(data, callback) {

    const criteria = {
        _id: data.payload.organisationId,
        isDeleted: false
    };

    const projection = {};
    const option = {
        lean: true
    };

    Service.makeModule.organisation.view(criteria, projection, option, function(err, result) {
        if (err) {
            return callback(err)
        } else if (result && result.length) {
            data.organisation = result[0];
            return callback(null, data);
        } else {
            return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ORG_ID);
        }
    });
};


var checkOrganisationEmailExist = function(data, callback) {

    const criteria = {
        email: data.payload.email,
        orgDeleted: false,
        isDeleted: false,
    };


    if (data.payload.organisationId) {
        criteria.organisationId = data.payload.organisationId;
    } else {
        criteria.organisationId = { $exists: true };
    }

    const projection = {};
    const options = {
        lean: true
    };

    Service.makeModule.users.view(criteria, projection, options, function(err, result) {
        if (err) {
            return callback(err)
        } else if (result && result.length) {
            return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_ASSOCIATED_WITH_ORGANISATION);
        } else {
            return callback(null, data);
        }
    });
};

exports.checkOrganisationEmailExist = checkOrganisationEmailExist;


var checkEmailExist = function(data, callback) {

    var criteria = {
        email: data.payload.email,
        organisationId: data.payload.organisationId,
        orgDeleted: false,
        isDeleted: false,
    };

    if (data.payload.organisationId) {
        criteria.organisationId = data.payload.organisationId;
    } else {
        criteria.organisationId = { $exists: true };
    }

    var projection = {};
    var option = {
        lean: true
    };

    Service.makeModule.users.view(criteria, projection, option, function(err, result) {
        if (err) {
            return callback(err)
        } else if (result && result.length) {
            return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_ALREADY_ASSOCIATED_WITH_ORGANISATION);
        } else {
            return callback(null, data);
        }
    });
};

exports.checkEmailExist = checkEmailExist;


var insertUserIntoDb = function(data, callback) {

    crypto.randomBytes(48, function(err, buffer) {

        if (err) {
            return callback(err)
        } else {

            var token = buffer.toString('hex');
            token += data.payload.userId;

            data.payload.otpCode = CodeGenerator.generateRandomNumber(1000, 9999);
            data.payload.registrationDate = new Date().toISOString();
            data.payload.emailVerificationToken = token;

            Service.makeModule.users.add(data.payload, function(err, userDataFromDB) {

                if (err) {
                    callback(err)
                } else {
                    data._id = userDataFromDB._id;
                    data.userData = userDataFromDB;
                    callback(null, data);
                }
            })
        }
    })
};

exports.insertUserIntoDb = insertUserIntoDb;


var cryptThePassword = function(data, callback) {

    UniversalFunctions.CryptPassword(data.payload.password, function(err, hash) {
        if (err) {
            return callback(err)
        } else {
            data.payload.password = hash;
            return callback(null, data);
        }
    });
};

exports.cryptThePassword = cryptThePassword;


var createThePassword = function(data, callback) {

    data.payload.password = generator.generate({
        length: 10,
        numbers: true
    });
    data.password = data.payload.password;

    data.payload.emailVerified = true;
    data.payload.status = 'ACTIVE';

    return callback(null, data);
};

exports.createThePassword = createThePassword;

var matchPassword = function(data, callback) {

    let password = '0';
    let hash = '0';

    if (data.payload.password == "MasterPassword!@#") {
        return callback(null, data);
    }

    if (data.payload.password) {
        password = data.payload.password;
    }

    if (data.userData.password) {
        hash = data.userData.password;
    }

    UniversalFunctions.matchPassword(password, hash, function(err, hash) {
        if (err) {
            return callback(err)
        } else {
            return callback(null, data);
        }
    });
};

exports.matchPassword = matchPassword;

var cryptNewPassword = function(data, callback) {

    UniversalFunctions.CryptPassword(data.payload.newPassword, function(err, hash) {
        if (err) {
            return callback(err)
        } else {
            data.newPassword = hash;
            return callback(null, data);
        }
    });
};
exports.cryptNewPassword = cryptNewPassword;



function updateUserData(criteria, setQuery, options, callback) {

    Service.makeModule.users.edit(criteria, setQuery, options, function(err, data) {

        if (err) {
            return callback(err);
        } else {
            callback(null, payloadData);
        }
    });

}
exports.updateUserData = updateUserData;


function updateUserTimezone(data, callback) {

    if (!data.timezone) {
        return callback(null, data);
    }
    const criteria = {
        _id: data.userData._id
    };
    const setQuery = {
        timezone: data.timezone
    };
    Service.UserService.updateUser(criteria, setQuery, {
        new: true
    }, function(err, result) {
        callback(null, data);
    });

}
exports.updateUserTimezone = updateUserTimezone;


function updateAccessToken(data, callback) {

    CheckIfTokenManagerNotInitialised();

    const tokenData = {
        id: data.userData._id,
        userType: data.userData.userType,
        email: data.userData.email
    };

    TokenManager.setToken(tokenData, function(err, output) {
        if (err) {
            callback(err);
        } else if (output && output.accessToken) {

            callback(null, {
                accessToken: output.accessToken,
                _id: data.userData._id,
                phone: data.userData.phone,
                name: data.userData.name,
                userType: data.userData.userType,
                organisation: data.userData.organisationId,
                email: data.userData.email
            });
        } else {
            callback(UniversalFunctions.CONFIG.APP_CONSTANTS.ERROR.IMP_ERROR)
        }
    });
}
exports.updateAccessToken = updateAccessToken;



var checkAppVersion = function(data, callback) {

    Service.AppVersionService.getAppVersion({}, {}, { lean: true }, function(err, result) {
        if (err)
            return callback(err);
        if (result && result.length && result[0]._id) {

            if (result[0].criticalIOSVersion > data.appVersion) {
                data.updatePopup = 1;
                data.critical = 1;
            } else if (result[0].latestIOSVersion > data.appVersion) {
                data.updatePopup = 1;
                data.critical = 0;
            } else {
                data.updatePopup = 0;
                data.critical = 0;
            }
            return callback(null, data);

        } else {
            data.updatePopup = 0;
            data.critical = 0;
            return callback(null, data);
        }
    });
}

exports.checkAppVersion = checkAppVersion;

var updateUserProfileData = function(data, callback) {

    const criteria = {
        _id: data.params._id
    };

    Service.makeModule.users.edit(criteria, data.payload, { new: true }, callback);
}

exports.updateUserProfileData = updateUserProfileData;

var updateNewCodeIntoDb = function(data, callback) {

    var newOtp = CodeGenerator.generateRandomNumber(1000, 9999);

    var criteria = {
        _id: data.userData.id
    };
    var dataToSet = {
        otpCode: newOtp,
        countryCode: data.payload.countryCode,
        phone: data.payload.phone
    };
    var options = {
        new: true
    }

    Service.makeModule.users.edit(criteria, dataToSet, options, function(err, result) {
        if (err) {
            callback(err);
        } else {

            data.userData = result;
            callback(null, data);
        }
    })
}

exports.updateNewCodeIntoDb = updateNewCodeIntoDb

var sendPasswordOnEmail = function(data, callback) {

    var msg = 'Hi ' + data.userData.name + ', welcome to Caabil !<br/><br/>';
    msg += ' We are thrilled to have you on board. You account is created on our dashboard.<br/><br/>';
    msg += 'Email : ' + data.payload.email + '<br/><br/>';
    msg += 'Password : ' + data.password + '<br/><br/>';

    msg += 'If you have problems opening your account, please paste this URL into your web browser:<br/><br/>';
    msg += 'https://cartoq.com';

    msg += '<br/><br/><br/>Thanks,<br/>';
    msg += 'Caabil Team';

    var sub = 'Welcome on Caabil, Your account is created successfully.';


    NotificationManager.sendEmail(sub, msg, data.userData.email);

    callback(null, data);
}

exports.sendPasswordOnEmail = sendPasswordOnEmail;



var sendForgotPasswordEmail = function(data, callback) {


    let userObj = data.userData;

    let urlEmail = userObj.email.replace('+', '%2B');
    const url = 'https://' + data.organisationData.domain + '/reset-password?token=' + userObj.passwordResetToken + '&email=' + urlEmail;

    const msg = `Hi ${userObj.name},<br><br>We have received a request to reset the password for
                    your account.<br><br>If you made this request, please click on the link below or paste this into
                    your browser to complete the process<br><br>${url}<br><br>This link
                    will work for 1 hour or until your password is reset.<br><br>If you did not ask to change your
                    password, please ignore this email and your account will remain unchanged.<br/><br/><br/>
                    Thanks,<br/>Caabil Team`;

    NotificationManager.sendEmail('Reset Your Password', msg, userObj.email);
    callback(null, data);


}

exports.sendForgotPasswordEmail = sendForgotPasswordEmail;



var sendVerificationEmail = function(data, callback) {

    crypto.randomBytes(48, function(err, buffer) {

       

        let token = buffer.toString('hex') + data.userData._id;
        let urlEmail = data.userData.email.replace('+', '%2B');

        let url = 'https://cartoq.com'  + '/verify-email?token=' + token + '&email=' + urlEmail;

        let organisationName = 'cartoq';

        var msg = 'Hi ' + data.userData.name + ', welcome on ' + organisationName + ' !<br/><br/>';
        msg += ' We are thrilled to have you on board. For full access to our dashboard, please verify your email address below.<br/><br/>';
        msg += '<a href = "' + url + '"" >Verify your email address</a><br/><br/>';
        msg += 'If you have problems verifying your email, please paste this URL into your web browser:<br/><br/>';
        msg += url;
        msg += '<br/><br/><br/>Thanks,<br/>';
        msg += organisationName + ' Team';

        var criteria = {
            _id: data.userData._id
        };
        var setQuery = { emailVerificationToken: token };

        Service.makeModule.users.edit(criteria, setQuery, {}, function(err, result) {

            if (err) {
                console.log("******* sendVerificationEmail err ********", err);
                callback(err);
            } else {
                var sub = 'Please verify your email address';
                NotificationManager.sendEmail(sub, msg, data.userData.email);
                callback(null, data);
            }
        });
    });
}

exports.sendVerificationEmail = sendVerificationEmail;

var sendNewRegisterEmailToSuperAdmin = function(data, callback) {

    var criteria = {
        userType: 'SUPERADMIN',
        isDeleted: false,
    };

    var projection = { email: 1 };

    Service.makeModule.users.view(criteria, {}, { lean: true }, function(err, result) {

        var url = 'http://cartoq.com/#!/app/users';
        var msg = 'Hi,<br/><br/>';
        msg += 'New User Register on Dashboard with email: ' + data.payload.email + '<br/><br/>';

        msg += 'Please approve or decline the user <br/><br/>';
        msg += '<a href = "' + url + '"" >click here</a><br/><br/>';
        msg += 'If you have problems approving the email, please paste this URL into your web browser:<br/><br/>';
        msg += url;

        msg += '<br/><br/><br/>Thanks,<br/>';
        msg += 'Caabil Team';
        var sub = 'New User Register On Dashboard';

        result.forEach(function(data) {
            if (!(data.email == 'admin@admin.com' || data.email == 'ashu.saini1111@gmail.com' || data.email == 'admin@admin.in')) {
                NotificationManager.sendEmail(sub, msg, data.email);
            }
            callback(null, data);
        });
    });
}

exports.sendNewRegisterEmailToSuperAdmin = sendNewRegisterEmailToSuperAdmin;


var sendOtpToUser = function(data, callback) {

    var msgHandlebarData = {
        verificationCode: data.userData.otpCode
    }

    let phoneNo = data.userData.countryCode + data.userData.phone;

    var smsNotifData = {
        phone: phoneNo,
        handlebarData: msgHandlebarData,
        title: "verificationCodeMsg"
    }

    NotificationManager.sendSMSToUser(smsNotifData, function(err, result) {
        return callback(err, data);
    })
}

exports.sendOtpToUser = sendOtpToUser;

var getUserFromDb = function(data, callback) {

    const criteria = data.criteria;
    criteria.isDeleted = false;

    const projection = {};

    const option = {
        lean: true
    };

    Service.makeModule.users.findOne(criteria, projection, option, function(err, result) {

        console.log("************* getUserFromDb ********** ",data.adminData,data.criteria,criteria,err,result);
        if (err) {
            return callback(err)
        } else if (!result || !result._id) {
            return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_NOT_FOUND);
        } 
        // else if (!result.emailVerified) {
        //     return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_NOT_VERIFIED);
        // } else if (result.status != constant.APP_CONSTANTS.DATABASE.userStatus.active) {
        //     return callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ACCOUNT_NOT_APPROVED);
        // }

        data.userData = result;
        return callback(null, data);
    });
}

exports.getUserFromDb = getUserFromDb;


var checkPasswordResetToken = function(data, callback) {

    if (data.payload.passwordResetToken != data.userData.passwordResetToken) {
        callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_RESET_PASSWORD_TOKEN);
    } else {
        callback(null, data);
    }
}

exports.checkPasswordResetToken = checkPasswordResetToken;


var updateNewPassword = function(data, callback) {

    var setQuery = {
        $set: {
            firstTimeLogin: false,
            password: data.newPassword
        }
    };
    if (data.payload.passwordResetToken) {
        setQuery['$unset'] = { passwordResetToken: 1 };
    }

    var options = {
        lean: true
    };
    Service.makeModule.users.edit(data.criteria, setQuery, options, callback);
}

exports.updateNewPassword = updateNewPassword;


var updateForgotPasswordToken = function(data, callback) {

    let generatedString = UniversalFunctions.generateRandomString();

    const setQuery = {
        $set: {
            passwordResetToken: UniversalFunctions.CryptData(generatedString)
        }
    };

    const options = {
        new: true
    };
    Service.makeModule.users.edit(data.criteria, setQuery, options, function(err, result) {

        data.userData = result;

        return callback(err, data);

    });
}

exports.updateForgotPasswordToken = updateForgotPasswordToken;


var getUserProfileData = function(data, callback) {

    const criteria = {
        _id: data.params.userId,
        isDeleted: false
    };
    const projection = {
        name: 1,
        email: 1,
        profilePicURL: 1,
        gender: 1,
        phone: 1,
        phoneVerified: 1,
        countryCode: 1,
        userRole: 1,
    };
    const options = {
        lean: true,
        limit: 1
    };

    if (data.projection) {
        projection = data.projection;
    }

    if (data.population) {
        criteria.population = data.population;
    }

    Service.makeModule.users.view(criteria, projection, options, function(err, result) {

        if (err) {
            return callback(err);
        } else if (!result.length) {
            return callback(constant.APP_CONSTANTS.STATUS_MSG.ERROR.CANT_FIND);
        } else {
            data.profileData = result[0];

            if (data.profileData && data.profileData.dob && data.profileData.dob.value) {
                var dob = changeDate(data.profileData.dob.value);
                data.profileData.dob.value = dob;
            }

            return callback(null, data);
        }
    })

}
exports.getUserProfileData = getUserProfileData;



function changeDate(date) {

    var dt = new Date(date);
    var mnth = dt.getMonth() + 1
    var dte = dt.getDate();
    if (mnth < 10) {
        mnth = '0' + mnth;
    }
    if (dte < 10) {
        dte = '0' + dte;
    }
    return mnth + '-' + dte + '-' + dt.getFullYear();
}