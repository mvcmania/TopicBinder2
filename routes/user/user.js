var express = require('express');
var router = express.Router();
var async = require('async');
var Pool = require('../../models/pool');
var Topic = require('../../models/topic');
var User = require('../../models/user');
var Assign = require('../../models/assignment');
var Doc = require('../../models/document');
var fs = require('fs'),
    xml2js = require('xml2js');
var path = require('path');

router.get('/', function (req, res) {
    async.parallel({
        projects: function (next) {
            Assign.getDistinctValues(req.user._id, 'project', function (err, res2) {
                next(null, res2);
            })
        }
    }, function (err, results) {
        console.log('projectss', results["projects"]);
        res.render('userdashboard', {
            projects: results["projects"]
        });
    });

});
router.get('/assignmentsummary', function (req, res, next) {
    console.log('user assignment', req.user._id);
    var projectid = req.query.projectid;
    if (projectid) {
        Assign.getSpecificUserAssignmentSummary(req.user._id, projectid, function (err, result) {
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        });
    } else {
        res.send(400, {
            status: 400,
            data: null,
            message: "Projectid can not be blank and so on!"
        });
    }
});
router.get('/topic', function (req, res, next) {
    console.log(req.query.assignmentid);
    Assign.getAssignmentById(req.query.assignmentid, function(err, doc){
        if(err){
            res.status(400).send({
                status: 400,
                data: err,
                message: "Error while retriving!"
            });
        }else{
            console.log(doc[0]);
            var returnData = {
                "document": null,
                "topic": doc[0].topic,
                "assign" : doc[0].assignment
            };
            if (doc[0].document) {
                var tempDoc = getDocumentDetail(doc[0].document);
                //console.log('Temp Obj = ', tempDoc);
                returnData['document'] = tempDoc;
            }
            console.log(returnData);
            res.status(200).send({
                status: 200,
                data: returnData,
                message: "Topic successfully retrived!"
            });
        }
    });
});
router.post('/update', function(req, res, next){
    console.log('BODY');
    console.log(req.body);
    var status = 200, data =null, message ='';
    
    if(req.body.assignment_id){
        async.parallel({
            update: function (next) {
                Assign.updateRelation(req.body.assignment_id, req.body.is_related, function(err, doc){
                    if(err){
                        next(err, null);
                    }else{
                        next(null, doc);
                    }
                });
            }
        }, function(err, results){
            if(err){
                res.status(400).send({
                    data: err,
                    message: 'Error occured'
                });
            }else{
                res.status(200).send({
                    data: results['update'],
                    message: 'Successfully updated!'
                });
            }
            
        });
        
    }else{
        res.status(400).send({
            data: null,
            message: 'Assignment id can not be blank'
        });
    }
    
   
});
var  getDocumentDetail = function(doc) {
    var parser = new xml2js.Parser({
        trim: true,
        async : false
    });
    var tempDoc = {};
    console.log('Doc= ', path.join(__dirname, '../../resources/extract/' + doc.document_file));
    var data = fs.readFileSync(path.join(__dirname, '../../resources/extract/' + doc.document_file))
    if (data) {
        console.log('DATAA');
        
        parser.parseString(data, function (err, result) {
            console.dir(result.ROOT.DOC[0]['TEXT']);
            if (result.hasOwnProperty('ROOT')) {
                for (var k in result.ROOT.DOC) {

                    if (result.ROOT.DOC[k].DOCNO == doc.document_no) {

                        tempDoc['DOCNO']=result.ROOT.DOC[k].DOCNO;

                        if(result.ROOT.DOC[k].hasOwnProperty('TEXT')){

                            result.ROOT.DOC[k]['TEXT'].forEach(function(txt){
                                
                                if (txt.hasOwnProperty('P')) {
                                    tempDoc['TEXT'] = [];
                                    txt['P'].forEach(function(txtItem) {
                                        tempDoc['TEXT'].push(txtItem);
                                    }, this);
                                } else {
                                    //console.log(m, '=', typeof(result.ROOT.DOC[0][m][indx]));
                                    tempDoc['TEXT'] = txt;  
                                }
                            }, this);
                            //console.log(m, '=', typeof(result.ROOT.DOC[0][m][indx]));
                            
                            
                        }
                    }
                }
            }
        });
    }else{
        return {};
    }
    return tempDoc;
}
    module.exports = router;