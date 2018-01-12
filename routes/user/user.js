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
    async.waterfall([
    function (next) {
        Assign.getDistinctValues(req.user._id, 'project', function (err, res2) {
            var result ={
                projects: res2,
                relations : [
                    {label:"Not Related",value:0,selected:false},
                    {label:"Related",value:1,selected:false},
                    {label:"Not Started",value:2,selected:true}
                ]
            };
            next(null, result);
        });
    }], 
    function (err, result) {
        //C.logger.info('summary', result.summary);
        res.render('userdashboard', result);
    });

});
router.get('/member/assignmentsummary', function (req, res, next) {
    C.logger.info('user assignment', req.user._id);
    var projectid = req.query.projectid;
    var relation = req.query.relation ? req.query.relation : 0;
    if (projectid) {
        async.waterfall([
            function(next){
                var returnResult ={'assignments':null,'summary':null};
                Assign.getSpecificUserAssignmentSummary(req.user._id, projectid, relation, function (err, res1) {
                    returnResult.assignments = res1;
                    next(null, returnResult);
                });
            },
            function(returnResult, next){
                Assign.getUserAssignmentSummary(req.user._id, projectid, function(err, res2){
                    returnResult.summary = res2;
                    next(null, returnResult);
                });
            }
        ], function(err, res3){
            res.status(200).send(res3);
        });
    } else {
        res.status(400).send({
            data: null,
            message: "Projectid can not be blank and so on!"
        });
    }
    
});
router.get('/member/topic', function (req, res, next) {
    C.logger.info(req.query.assignmentid);
    Assign.getAssignmentById(req.query.assignmentid, function(err, doc){
        if(err){
            res.status(400).send({
                status: 400,
                data: err,
                message: "Error while retriving!"
            });
        }else{
            C.logger.info('document id= ',doc);
            var returnData = {
                "document": null,
                "topic": doc[0].topic,
                "assign" : doc[0].assignment
            };
            if (doc[0].document && doc[0].document.document_file) {
                var tempDoc = getDocumentDetail(doc[0].document, doc[0].assignment);
                C.logger.info('Temp Obj = ', tempDoc);
                returnData['document'] = tempDoc;
            }
            C.logger.info(returnData);
            res.status(200).send({
                status: 200,
                data: returnData,
                message: "Topic successfully retrived!"
            });
        }
    });
});
router.post('/member/update', function(req, res, next){
    C.logger.info('BODY');
    C.logger.info(req.body);
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
var  getDocumentDetail = function(doc, assignItem) {
    var parser = new xml2js.Parser({
        trim: true,
        async : false
    });
    var tempDoc = {};
    var split = doc.document_file.split('/');
    C.logger.info('Doc= ', path.join(__dirname, '../../projects/' +assignItem.project+'/'+split[0]+ '/parsed/' + split[1]));
    try{
        var data = fs.readFileSync(path.join(__dirname, '../../projects/' +assignItem.project+'/'+split[0]+ '/parsed/'+ split[1]));
        if (data) {
            /* var newData ='<ROOT>'+data+'</ROOT>';
            C.logger.info('DATAA'+newData); */
            tempDoc['TEXT'] = '';
            tempDoc['DOCNO'] = assignItem.document_no.length > 0 ? assignItem.document_no[0] : '';
                var reg = buildRegex(doc.document_no);
                while ((m = reg.exec(data)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === reg.lastIndex) {
                    reg.lastIndex++;
                    }
                    tempDoc['TEXT'] = m[2];
                    //tempDoc['DOCNO'] = m[1];
                }
            return tempDoc;
        }else{
            return {};
        }
    }catch(err){
        return {};
    }
    return tempDoc;
}
function buildRegex(docno){
    var tempRegex = '<DOC>\\n<DOCNO>(\\s'+docno+'\\s)<\\/DOCNO>[\\s\\S]*?<TEXT>([\\s\\S]*?)<\\/TEXT>[\\s\\S]*?<\\/DOC>';
    return new RegExp(tempRegex,'g');
    //<DOC>\n<DOCNO>(\sFBIS3-10753\s)<\/DOCNO>[\s\S]*?<TEXT>([\s\S]*?)<\/TEXT>[\s\S]*?<\/DOC>
}
module.exports = router;