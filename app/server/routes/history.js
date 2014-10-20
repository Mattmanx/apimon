/**
 * Created by mattmehalso on 10/20/14.
 */
var express = require('express');
var router = express.Router();
var model = require('../models/history');
var logger = require('winston');

/*
 * GET API History. Default to Page 1
 */
router.get('/results', function(req, res) {
    model.get(1, function(err, docs) {
        if(err) {
            res.status(500).json({message: "Unable to retrieve store historical data."});
        } else {
            res.json(docs);
        }
    });
});

/*
 * GET API History at the specified page.
 */
router.get('/results/:page', function(req, res) {
    model.get(req.params.page, function(err, docs) {
        if(err) {
            res.status(500).json({message: "Unable to retrieve store historical data."});
        } else {
            res.json(docs);
        }
    });
});

module.exports = router;