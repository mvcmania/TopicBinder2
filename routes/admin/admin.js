var express = require('express');
var router = express.Router();
var Pool = require('../../models/pool');


router.get('/', function(req, res) {
    Pool.find({}, function(err, pools) {
        res.render('dashboard', { pools: pools });
    });

});
var pool = require('../models/pool');
module.exports = router;