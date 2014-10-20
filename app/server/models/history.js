var logger = require('winston');
var config = require('../../config');
var Datastore = require('nedb');

var db;
var History = {};

/**
 * Adds a failure record to the datastore
**/
History.addFailure = function(errorMessage, statusCode) {
    var record = {
        dateTime: new Date(),
        isFailure: true
    };
    
    if(statusCode && errorMessage) {
        record.message = statusCode + ": " + errorMessage;   
    } else if(statusCode) {
        record.message = statusCode;
    } else if(errorMessage) {
        record.message = errorMessage;
    } else {
        record.message = "Unknown Failure";
    }
    
    saveOne(record);
}

/**
 * Adds a success record to the datastore
**/
History.addSuccess = function() {
    var record = {
        dateTime: new Date(),
        isFailure: false
    };
    
    record.message = "200: OK";
    
    saveOne(record);
}

//Return records from the datastore, returning a maximum number of records at the given page offset
History.get = function(page, callback) {
    var offset;
    if(!page) {
        offset = 0;
    } else {
        offset = (page - 1) * config.persistenceConfig.maxRecordsToReturn;
    }
    
    db.find({}).sort({ dateTime: 1}).skip(offset).limit(config.persistenceConfig.maxRecordsToReturn).exec(function (err, docs) {
        if(err) {
            logger.error('History model returned error.  Message: ' + err.message);
        } else {
            logger.info('History model returned ' + docs.size + ' records.');
        }


        callback(err, docs);
    });     
}

//Hidden functions
//Initialization
var init = function() {
    if(config.persistenceConfig && config.persistenceConfig.persistApiHistory && 
       config.persistenceConfig.location) {
        //initialize the db as persistent and point to disk
        db = new Datastore({filename: config.persistenceConfig.location, autoload: true});
        logger.info("API History database initialized on file system at: " + config.persistenceConfig.location);
    } else {
        //initialize the db in memory 
        db = new Datastore({autoload: true});
        logger.info("API History database initialized in memory.");
    }
}

//reusable saver
var saveOne = function(record) {
    db.insert(record, function(err, docId) {
        if(err) {
            logger.error('Error while saving history record. Error message: ' + err.message);
        } else {
            logger.info('New record added with id: ' + docId._id);
        }
    });

}

init();

module.exports = History;

logger.info("History module loaded.");