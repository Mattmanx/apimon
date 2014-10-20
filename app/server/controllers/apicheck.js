var logger = require('winston');
var rest = require('restler');
var config = require('../../config').apiConfig;
var history = require('../models/history');

var ApiCheckController = {};

var initialize = function () {
    ApiCheckController.config = {};
    
    //TODO: GET THESE FROM CONFIG!! Figure out a way to inject them? 
    ApiCheckController.config.endpoint = config.apiEndpoint;
    ApiCheckController.config.user = config.apiUser;
    ApiCheckController.config.pass = config.apiPass;
    ApiCheckController.config.headers = config.apiHeaders;
};

ApiCheckController.checkApi = function (successCallback, failCallback) {
    logger.info("Calling configured  API and checking response code.");
   
    rest.get(ApiCheckController.config.endpoint,
         {  username: ApiCheckController.config.user,
            password: ApiCheckController.config.pass,
            headers: ApiCheckController.config.headers,
            timeout: config.timeout
         })
        .on('complete', function (result, response) {
            if (result instanceof Error) {
                logger.error('Error:' + result.message);
                
                history.addFailure(result.message);
                
                failCallback(-1, result.message);
            } else {
                if (response.statusCode == 200) {
                    history.addSuccess();
                    
                    successCallback(result);
                } else {
                    history.addFailure(null, response.statusCode);
                    
                    failCallback(response.statusCode);
                }
            }
        })
        .on('timeout', function(ms) {
            history.addFailure("Timeout after " + ms + " ms.");
        
            failCallback(-1);
        });
};

initialize();

module.exports = ApiCheckController;

logger.info("apicheck.js loaded.");