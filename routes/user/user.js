var express = require('express');
var router = express.Router();
var async = require('async');
var Pool = require('../../models/pool');
var Topic = require('../../models/topic');
var User = require('../../models/user');
var Assign = require('../../models/assignment');
var Doc = require('../../models/document');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var Iconv  = require('iconv-lite');

router.get('/', function (req, res) {
    async.waterfall([
            function (next) {
                Assign.getDistinctValues(req.user._id, 'project', function (err, res2) {
                    var result = {
                        projects: res2,
                        relations: [{
                                label: "Not Related",
                                value: 0,
                                selected: false
                            },
                            {
                                label: "Related",
                                value: 1,
                                selected: false
                            },
                            {
                                label: "Not Started",
                                value: 2,
                                selected: true
                            }
                        ]
                    };
                    next(null, result);
                });
            }
        ],
        function (err, result) {
            //C.logger.info('summary', result.summary);
            res.render('userdashboard', result);
        });

});
router.get('/member/assignmentsummary', function (req, res, next) {
    C.logger.info('user assignment', req.user._id);
    var projectid = req.query.projectid;
    var relation = req.query.relation ? req.query.relation : 0;
    var skip =  req.query.skip;
    if (projectid) {
        async.waterfall([
            function (next) {
                var returnResult = {
                    'assignments': null,
                    'summary': null,
                    'pagination':null
                };
                Assign.getSpecificUserAssignmentSummary(req.user._id, projectid, relation, skip, function (err, res1) {
                    returnResult.assignments = res1.records;
                    returnResult.pagination = res1.pagination;
                    next(null, returnResult);
                });
            },
            function (returnResult, next) {
                Assign.getUserAssignmentSummary(req.user._id, projectid, function (err, res2) {
                    returnResult.summary = res2;
                    next(null, returnResult);
                });
            }
        ], function (err, res3) {
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
    try {
        C.logger.info(req.query.assignmentid);
        Assign.getAssignmentById(req.query.assignmentid, function (err, doc) {
            if (err) {
                res.status(400).send({
                    status: 400,
                    data: err,
                    message: "Error while retriving!"
                });
            } else {
                C.logger.info('document id= ', doc);
                var returnData = {
                    "document": null,
                    "topic": doc[0].topic,
                    "assign": doc[0].assignment
                };
                /* getDocumentDetail */getDocumentDetailStream(doc[0], function(err, tempDoc){
                    C.logger.info('Temp Obj = ', tempDoc);
                    C.logger.info('err = ', err);
                    returnData['document'] = tempDoc;
                    res.status(200).send({
                        status: 200,
                        data: returnData,
                        message: "Topic successfully retrived!"
                    });
                    
                });
               
            }
        });
    } catch (exp) {
        res.sendError("Unexpected error occured!", {
            data: null
        });
    }
});
router.post('/member/update', function (req, res, next) {
    C.logger.info('BODY');
    C.logger.info(req.body);
    var status = 200,
        data = null,
        message = '';

    if (req.body.assignment_id) {
        async.parallel({
            update: function (next) {
                Assign.updateRelation(req.body.assignment_id, req.body.is_related, function (err, doc) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, doc);
                    }
                });
            }
        }, function (err, results) {
            if (err) {
                res.status(400).send({
                    data: err,
                    message: 'Error occured'
                });
            } else {
                res.status(200).send({
                    data: results['update'],
                    message: 'Successfully updated!'
                });
            }

        });

    } else {
        res.status(400).send({
            data: null,
            message: 'Assignment id can not be blank'
        });
    }


});
var getDocumentDetail = function (doc, cb) {
    
    if(!doc.document || !doc.document.document_file || !doc.assignment){
        return cb('Record has not found', null);
        
    }
    console.log(path.join(__dirname,'../',doc.document.document_file));
    fs.readFile(path.join(__dirname,'../',doc.document.document_file),function(err, data){
        if (err) {
            return  cb(err, null);
        }else{
            const tempDoc = {};
            /* var newData ='<ROOT>'+data+'</ROOT>';
            C.logger.info('DATAA'+newData); */
            tempDoc['TEXT'] = '';
            tempDoc['DOCNO'] = doc.assignment.document_no.length > 0 ? doc.assignment.document_no[0] : '';
            var reg = buildRegex(doc.document.document_no, doc.project);
            while ((m = reg.exec(data)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === reg.lastIndex) {
                    reg.lastIndex++;
                }
                tempDoc['TEXT'] = m[2];
                //tempDoc['DOCNO'] = m[1];
            }
            return cb(null, tempDoc);
        }
    });
}
var getDocumentDetailStream = function (doc, cb) {
    
    if(!doc.document || !doc.document.document_file || !doc.assignment){
        return cb('Record has not found', null);
        
    }
    var reg = buildRegex(doc.document.document_no, doc.project);
    console.log(path.join(__dirname,'../',doc.document.document_file));
    const tempDoc = {};
    tempDoc['TEXT'] = '';
    tempDoc['DOCNO'] = doc.assignment.document_no.length > 0 ? doc.assignment.document_no[0] : '';
    var strm = fs.createReadStream(path.join(__dirname,'../',doc.document.document_file))
        .pipe(Iconv.decodeStream('win1254'))
        .pipe(es.split('</DOC>'))
        .pipe(es.mapSync(function(line){
            strm.pause();
            var newLine = line +'</DOC>';
            while ((m = reg.exec(newLine)) !== null) {
                
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === reg.lastIndex) {
                    reg.lastIndex++;
                }
                tempDoc['TEXT'] = m[2];
                
                strm.end();
             }
             strm.resume();
        }))
        .on('error', function(err){
            return cb(err, null);
        })
        .on('end', function(){
            return cb(null, tempDoc);
        });
}
function buildRegex(docno, prj) {

    var tempRegex = '<DOC>\\n<'+prj.docno_tag+'>(\\s*' + docno + '\\s*)<\\/'+prj.docno_tag+'>[\\s\\S]*?<'+prj.text_tag+'>([\\s\\S]*?)<\\/'+prj.text_tag+'>[\\s\\S]*?<\\/DOC>';
    return new RegExp(tempRegex, 'g');
    //<DOC>\n<DOCNO>(\sFBIS3-10753\s)<\/DOCNO>[\s\S]*?<TEXT>([\s\S]*?)<\/TEXT>[\s\S]*?<\/DOC>
}
module.exports = router;