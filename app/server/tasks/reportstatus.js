var logger = require('winston');
var apicontroller = require('../controllers/apicheck');
var emailer = require('../controllers/email');

var ReportStatusTask = {};

ReportStatusTask.report = function () {
    apicontroller.checkApi(function (message) {
        logger.info("Successful Airwatch Call!");
        logger.info("Response: " + JSON.stringify(message));
    }, function (code, message) {
        logger.error("Failed Airwatch Call. Status Code " + code);
        if(code && code > 0) {
            emailer.send("HTTP Error code returned: " + code);
        } else if(message) { 
            emailer.send("Error calling API: " + message);
        }
    });
};

module.exports = ReportStatusTask;

logger.info("reportstatus.js loaded.");