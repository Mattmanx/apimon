/**
 * Created by mattmehalso on 10/19/14.
 */
var logger = require('winston');
var reportTask = require('./server/tasks/reportstatus');
var cron = require('cron').CronJob;
var config = require('./config');

var Batch = {};

Batch.start = function() {
    logger.info("Starting batch process to monitor API calls.");

    //call the api right away
    reportTask.report();

    //schedule future calls hourly
    var cronDateTime = config.taskConfig.cronSchedule;
    var schedApiCall = new cron(cronDateTime, reportTask.report, null, true);

    logger.info("Batch process started.");
}

module.exports = Batch;