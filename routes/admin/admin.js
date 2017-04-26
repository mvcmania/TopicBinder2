var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('dashboard');
});
var pool  = require('../models/pool');
module.exports = router;