/**
 * Created by mattmehalso on 10/19/14.
 */
var express = require('express');
var config = require('../../config');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'API Execution History',
                          apiUrl: config.apiConfig.apiEndpoint,
                          apiMethod: config.apiConfig.apiMethod,
                          apiTimeout: config.apiConfig.timeout
    });
});

module.exports = router;
