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
            next(null, res2);
        });
    },
    function(projects, next){
        var projectid = projects.length > 0 ? projects[0] : "";
        Assign.getUserAssignmentSummary(req.user._id, projectid, function(err, res3){
            var result ={
                projects: projects,
                relations : [0,1,2],
                summary : res3
            };
            next(null, result);
        });
    }], 
    function (err, result) {
        console.log('summary', result.summary);
        res.render('userdashboard', result);
    });

});
router.get('/assignmentsummary', function (req, res, next) {
    console.log('user assignment', req.user._id);
    var projectid = req.query.projectid;
    var relation = req.query.relation ? req.query.relation : 0;
    if (projectid) {
        Assign.getSpecificUserAssignmentSummary(req.user._id, projectid, relation, function (err, result) {
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
            console.log('document id= ',doc);
            var returnData = {
                "document": null,
                "topic": doc[0].topic,
                "assign" : doc[0].assignment
            };
            if (doc[0].document && doc[0].document.document_file) {
                var tempDoc = getDocumentDetail(doc[0].document, doc[0].assignment);
                console.log('Temp Obj = ', tempDoc);
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
var  getDocumentDetail = function(doc, assignItem) {
    var parser = new xml2js.Parser({
        trim: true,
        async : false
    });
    var tempDoc = {};
    var split = doc.document_file.split('/');
    console.log('Doc= ', path.join(__dirname, '../../resources/extract/' +split[0]+ '/parsed/' + split[1]));
    var data = fs.readFileSync(path.join(__dirname, '../../resources/extract/' +split[0]+ '/parsed/'+ split[1]));
    if (data) {
        /* var newData ='<ROOT>'+data+'</ROOT>';
        console.log('DATAA'+newData); */
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
        /* parser.parseString(newData, function (err, result) {
            //console.log('result.ROOT'+result);
            console.dir(err);
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
        }); */
    }else{
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