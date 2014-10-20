#!/bin/env node
var logger = require('winston');
var config = require('./app/config');
var batchapp = require('./app/batch');
var webapp = require('./app/app');

logger.info('***************');
logger.info('***************');

/**
 * Define the sample application.
 */
var ApiMonitor = function() {

    // Scope.
    var self = this;

    /* ================================================================ */
    /* Helper functions. */
    /* ================================================================ */

    /**
	 * Set up server IP address and port # using env variables/defaults.
	 */
    self.setupVariables = function() {
        //nothing for now
    };

    /**
	 * terminator === the termination handler Terminate server on receipt of the
	 * specified signal.
	 * 
	 * @param {string}
	 *            sig Signal to terminate on.
	 */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            logger.warn('Received ' + sig + ' - terminating application', 'server.js');
            process.exit(1);
        }
        logger.warn('Node server stopped', 'server.js');
    };


    /**
	 * Setup termination handlers (for exit and a list of signals).
	 */
    self.setupTerminationHandlers = function(){
        // Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /* ================================================================ */
    /* App server functions (main app logic here). */
    /* ================================================================ */

    /**
	 * Initialize the server (express) and create the routes and register the
	 * handlers.
	 */
    self.initializeServer = function() {
        webapp.set('port', process.env.PORT || config.listenPort);
    };


    /**
	 * Initializes the application.
	 */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
	 * Start the server (starts up the application).
	 */
    self.start = function() {
        batchapp.start();

        var server = webapp.listen(webapp.get('port'), function() {
            logger.info('Express server listening on port ' + server.address().port);
        });
    };
};



/**
 * main(): Main code.
 */
var app = new ApiMonitor();
app .initialize();
app .start();