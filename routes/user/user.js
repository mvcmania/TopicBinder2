var express = require('express');
var router = express.Router();
var async = require('async');
var Pool = require('../../models/pool');
var Topic = require('../../models/topic');
var User = require('../../models/user');
var Assign = require('../../models/assignment');
router.get('/', function (req, res) {
    async.parallel({
      projects: function (next) {
            Assign.getDistinctValues(req.user._id, 'project', function (err, res2) {
                next(null, res2);
            })
        }
    }, function (err, results) {
        console.log('projectss',results["projects"]);
        res.render('userdashboard', {
            projects:results["projects"]
        });
    });

});
router.get('/assignmentsummary', function(req, res, next) {
    console.log('user assignment',req.user._id);
    var projectid = req.query.projectid;
     if(projectid){
        Assign.getSpecificUserAssignmentSummary(req.user._id, projectid,function(err,result){
             res.send(result, {
                'Content-Type': 'application/json'
                }, 200);
        });
     }else{
         res.send(400, {status: 400, data: null, message: "Projectid can not be blank and so on!"});
     }
});
router.get('/topic', function(req, res, next){
    Topic.getTopicDetail(req.query.topicid, function(err, doc){
        if(err){
             res.send(400, {status: 400, data: err, message: "Topic can not be found!"});
        }else{
             res.send(200, {status: 200, data: doc, message: "Topic successfully retrived!"});
        }
    });
});

module.exports = router;