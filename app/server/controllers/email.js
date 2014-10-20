var logger = require('winston');
var nodemailer = require('nodemailer');
var config = require('../../config');

var transporter = nodemailer.createTransport({
    host: config.emailConfig.smtpServerAddress,
    port: config.emailConfig.smtpServerPort,
    secure: true,
    auth: {
        user: config.emailConfig.smtpAccount,
        pass: config.emailConfig.smtpAccountPassword
    }
});

var Email = {};

Email.send = function(message) {
    var mailOptions = {
        from: config.emailConfig.emailFrom, // sender address
        to: config.emailConfig.emailTo, // list of receivers
        subject: "Alert: API Failure", // Subject line
        text: message, // plaintext body
        html: '<h1>Alert: API Failure</h1><p><b>Endpoint: ' + config.apiConfig.apiEndpoint + '</b></p><p>Message or Status Code: ' + message + '</p>' // html body
    };
    
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};

module.exports = Email;

logger.info("email.js loaded.");