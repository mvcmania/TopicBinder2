var express = require('express');
var exphbs = require('express-handlebars');
var router = express.Router();
var Busboy = require('busboy');
var inspect = require('util').inspect;
var async = require('async');
var Pool = require('../../models/pool');
var Project = require('../../models/project');
var Topic = require('../../models/topic');
var User = require('../../models/user');
var Assign = require('../../models/assignment');
var mongoose = require('mongoose');
var json2csv = require('json2csv');
var dateFormat = require('dateformat');
var fse = require('fs-extra');
var api = require('../fileManager/routes');
var Tools = require('../fileManager/tools');
var path = require('path');
var es = require('event-stream');
var docInfoGenerator = require('./documentInfo');
var connections = [];

var datasetPath = path.join(__dirname, '../../', C.datasetPath);
router.all('/admin/api(*)', function (req, resp, next) {
    C.logger.info('Admin api put');
    api(req, resp, next);
});
router.get('/usermanagement', function(req, res, next){
    User.pullNonAdminsAll(function(err, usrs){
        res.render('usermanagement',{users:usrs});
    })
    /* res.render('usermanagement'); */
})
router.get('/', function (req, res) {

    try {
        async.parallel({
            users: function (next) {
                User.pullNonAdmins(next);
            },
            projects: function (next) {
                Project.find().distinct('name', next);
            },
            datasets: function (next) {
                fse.readdir(datasetPath, next);
                //next(null, ['TREC5','TREC6']);
            }
        }, function (err, results) {
            res.render('dashboard', {
                pools: {},
                users: results['users'],
                projects: results['projects'],
                datasets: results['datasets']
            });
        });
    } catch (exp) {
        res.sendError('Unexpected error occured!', {
            pools: {},
            users: [],
            projects: [],
            datasets: []
        });
    }

});
router.get('/admin/stream', function (req, res, next) {
    res.sseSetup();
    connections.push(res);
});
router.get('/admin/topicsummary', function (req, res, next) {

    try {
        C.logger.info('Topic Summary', req.url);
        var projectid = req.query.projectid;
        if (projectid) {
            async.waterfall([
                function (next) {
                    Pool.getTopicsSummary(projectid, next);
                }
            ], function (err, result) {
                res.send(result, {
                    'Content-Type': 'application/json'
                }, 200);
            });

        } else {
            //var msg ={'message':'Projectid can not be blank and so on!'};
            res.send(400, {
                status: 400,
                data: null,
                message: "Projectid can not be blank and so on!"
            });
        }
    } catch (exp) {
        res.sendError("Unexpected error occured!", {
            data: null
        });
    }

});
router.post('/admin/assign', function (req, res, next) {
    try {
        async.waterfall([
            function (cb) {
                Topic.validateTopic(req.body.topicid, function (err, doc) {
                    if (!err && doc) {
                        cb(null);
                    } else {
                        cb({
                            "message": "You can not assign! Topic info not found in the system!"
                        }, null);
                    }
                });
            },
            function (cb) {
                Pool.getTopics(req.body.topicid, req.body.projectid, req.body.numberoftopic, function (err, res1) {
                    var assignItemArr = [];
                    var uniqueidSet = [];
                    if (!err && res1 && res1.length > 0) {
                        res1.forEach(function (element) {
                            var assignItem = new Assign({
                                pool_id: mongoose.Types.ObjectId(element._id), //res1[tp].topic_id,
                                user_id: mongoose.Types.ObjectId(req.body.recipient),
                                project: req.body.projectid,
                                topic_id: req.body.topicid

                            });
                            uniqueidSet.push(element._id);
                            assignItemArr.push(assignItem);
                        }, this);
                    } else {
                        cb({
                            "message": "Error while getting topics to assign",
                            "data": err
                        }, null);
                    }
                    cb(null, assignItemArr, uniqueidSet);
                });
            },
            function (assignItemArr, uniqueidSet, cb) {
                //C.logger.info('Assignment err',assignItemArr);
                Assign.createAssignments(assignItemArr, function (err, res2) {
                    cb(err, uniqueidSet);
                });
            },
            function (uniqueidSet, cb) {
                Pool.updateTopicsByUniqueId(uniqueidSet, true, function (err, res3) {
                    var resultMain = {
                        "topic_id": req.body.topicid,
                        "result": res3
                    };
                    cb(null, resultMain);
                });
            }
        ], function (err, results) {
            if (err) {
                res.status(400).send({
                    status: 400,
                    data: err.data,
                    message: err.message
                });
            } else {
                res.status(200).send({
                    status: 200,
                    data: null,
                    message: "Assigned Successfully!"
                });
            }
        });
    } catch (exp) {
        res.sendError("Unexpected error occured!", {
            data: null
        });
    }

});
router.post('/admin/upload', function (req, res, next) {
    try {
        var context = req || this,
            busboy = new Busboy({
                headers: context.headers
            });

        var fileType = '';

        var topicFileRows = '';
        var PROJECTITEM = {
            "project-name":"",
            "dataset":"",
            "docno-tag":"",
            "text-tag":""
        };
        var rowCount = 0;
        var prop = ['num', 'title', 'desc', 'narr'];
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            C.logger.info('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

            file.on('data', function (data) {
                if (fieldname.startsWith('topicFile')) {
                    topicFileRows += data;
                }
                C.logger.info('Data with read data : file name :' + fieldname);
            });
            file.on('end', function () {
                C.logger.info('End with read data : file name :' + fieldname);

            });
        });
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

            if(PROJECTITEM.hasOwnProperty(fieldname)){
                PROJECTITEM[fieldname] = inspect(val) ? inspect(val).replace(/'/g, '') : inspect(val);
            }
            C.logger.info('FieldName', fieldname);
            C.logger.info('inspect(val)', inspect(val));
        });
        busboy.on('finish', function () {
            C.logger.info('Done parsing form!');
            async.waterfall([
                    function (cb) {
                        var projectRecord = new Project({
                            "name": PROJECTITEM["project-name"],
                            "dataset": PROJECTITEM["dataset"],
                            "docno_tag": (PROJECTITEM["docno-tag"] ? PROJECTITEM["docno-tag"] : 'DOCNO'),
                            "text_tag" : (PROJECTITEM["text-tag"] ? PROJECTITEM["text-tag"] : 'TEXT')
                        });
                        Project.create(projectRecord, function (err, res) {
                            cb(err);
                        });
                    },
                    function (cb) {

                        uploadTopicFile(topicFileRows, res, prop, cb);
                    },
                    function (cb) {
                        var projectPath = path.join(__dirname,'../..',C.projectsPath, PROJECTITEM["project-name"],'run');
                        fse.ensureDir(projectPath, cb);
                    }
                ],
                function (err) {
                    if (err) {
                        C.logger.info("Error occured..on bulk pool saving...", err);
                        res.status(400).send({
                            status: 400,
                            data: err,
                            message: "Error occured on bulk saving!"
                        });
                    } else {

                        res.status(200).send({
                            status: 200,
                            data: null,
                            message: "Redirect!"
                        });
                    }
                });

        });

        req.pipe(busboy);
    } catch (exp) {
        res.sendError("Unexpected error occured!", {
            data: null
        });
    }
});
router.post('/admin/assignmentsummary', function (req, res, next) {
    try {
        Assign.getTopicAssignmentSummary(req.query.projectid, req.query.topicid,
            function (err, result) {
                var rt;
                if (err)
                    rt = err;
                else
                    rt = result;
                res.send(rt, {
                    'Content-Type': 'application/json'
                }, 200);

            });
    } catch (exp) {
        res.sendError("Unexpected error occured!", {
            data: null
        });
    }
});
router.post('/admin/createpool', Tools.checkTrackIdExists, function (req, res, next) {
    try {
        //res.status(200).send(hbs.handlebars.compile('<p>ECHO: {{message}}</p>'));
        C.logger.info('Admin create pool =', req.body);
        C.logger.info('Admin create pool rowCount=', res.locals.rowCount);
        C.logger.info('Admin create pool delimiter=', req.body.delimiter);
        //res.locals.runRoot = path.join(__dirname, res.locals.runRoot);
        const inputFileTempsRows = {};
        const totalRows = [];

        const totalCount = res.locals.rowCount;
        async.waterfall([
            function (cb) {
                fse.readdir(res.locals.runRoot, cb);
            },
            function (files, cb) {
                var paths = files.map(function (file) {
                    return path.join(res.locals.runRoot, file)
                });
                paths.forEach(function (path, key) {

                    var onData = function (row) {
                        var spl = row.split('\t');
                        if(inputFileTempsRows.hasOwnProperty(spl[0])){
                            inputFileTempsRows[spl[0]] +=1; 
                        }else{
                            inputFileTempsRows[spl[0]] =0; 
                        }
                        if(inputFileTempsRows[spl[0]] < totalCount){
                            totalRows.push(spl);
                        }
                    }
                    var fileStream = fse.createReadStream(path)
                    .pipe(es.split())
                    .pipe(es.mapSync(onData))
                    .on('error',cb)
                    .on('end', function(){
                        C.logger.info('End');
                        if (key + 1 == paths.length) {
                            C.logger.info('doneParsing');
                            cb(null, totalRows);
                        }
                    });

                    C.logger.info('Delimiter', req.body.delimiter);
                    

                   

                });
            },
            function (inputRows, cb) {

                uploadInputFile(inputRows, req.body.project, cb);
            }
        ], function (err) {
            if (err) {
                C.logger.error('Error creating pool', err);
                res.status(400).send('Error occured while creating pools!');
            } else {
                res.status(200).send('Pool created success!');
            }

        });
    } catch (exp) {
        res.sendError("Unexpected error occured", {
            data: null
        });
    }
});
router.get('/admin/exportqrel', function (req, res, next) {
    try {
        var project = req.query.project;
        Assign.exportQrel(project, function (err, docs) {
            var myData = [];
            if (err) {
                myData.push({
                    "Error": "Error Occured while generating qrel!"
                });
            } else {
                myData = docs;
            }
            var now = new Date();
            var formatDate = dateFormat(now, "ddmmyyyy_HH:MM:ss");
            csv = json2csv({
                data: myData,
                del: ' ',
                quotes: '',
                hasCSVColumnTitle: false
            });
            res.setHeader('Content-disposition', 'attachment; filename=qrel.' + project + '_' + formatDate);
            res.setHeader('Content-type', 'text/plain');
            res.end(csv);
        });
    } catch (exp) {
        res.sendError("Unexpected error occured", {
            data: null
        });
    }
});
router.post('/admin/user/:userid', function(req, res, next){
    console.log(req.params);
    console.log(req.body);
    User.findById(mongoose.Types.ObjectId(req.params.userid),(err, record)=>{
        record.isactive = req.body.isactive;
        record.isadmin = req.body.isadmin;
        record.save();
        if(err){
            res.sendError('Error while saving',{});
        }else{
            res.status(200).send({});
        }
    });
    
});
router.delete('/admin/:projectid', Tools.checkProjectId, function(req, res, next){
    try {
        var params = req.params;
        C.logger.info('DELETE',params);
        Project.cleanTrack(params.projectid, function(err, results){
            
            if(err){
                res.sendError(JSON.stringify(err), {data:null});
            }else{
                var pPath = path.join(__dirname,'../..',C.projectsPath, params.projectid);
                fse.remove(pPath, err=>{
                    if(err){
                        res.status(400).send('Track has been removed but not from the file system!');
                    }else{
                    
                        res.status(200).send('Track has been removed from the system successfully!');
                    }
                });
                
            }
        });
    } catch (exp) {
        res.sendError("Unexpected error occured!", {data:null});
    }
});

function uploadInputFile(recordsArray, project, cb) {

    var pool_array = [];
    var doc_array = [];
    recordsArray.forEach(el => {
        if(!el || !el[0]){
            return;
        }
        var plItem = new Pool({
            "topic_id": el[0],
            "document_id": el[2],
            "index": parseInt(el[3]),
            "score": el[4] ? mongoose.Types.Decimal128.fromString(el[4]) : null,
            "search_engine_id": el[5],
            "docno_projectid":el[2]+'_'+project,
            "is_assigned": false,
            "project": project
        });
        doc_array.push(el[2]);

        pool_array.push(plItem);
    });


    if (pool_array.length > 0) {
        Pool.createPoolItems(pool_array, function (err, docs) {
            //Error code : 11000 (duplicate error no need to send 400)
            if (err && err.code != 11000) {
                C.logger.info("Error occured..on bulk pool saving...", err);
                cb({
                    "message": "Error occured on bulk saving!"
                });
            } else {
                uploadDocumentInfo(doc_array, project);
                cb(null);

            }
        });
    } else {
        cb(null);
    }
}

function uploadTopicFile(data, res, prop, cb) {
    let m;
    var topics = [];
    //Split with new line
    prop.forEach(pel => {
        var reg = buildRegex(pel);
        var count = -1;
        while ((m = reg.exec(data)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === reg.lastIndex) {
                reg.lastIndex++;
            }
            count++;
            var topicItem = topics[count];
            topicItem = Topic.mapRegex(m, pel, topicItem);
            topics[count] = topicItem;
        }
    });
    if (topics.length > 0) {
        Topic.createTopics(topics, function (err, tps) {
            if (err) {
                C.logger.info("Error occured..on bulk topic saving...", err);

                cb({
                    "message": "Error occured on bulk topic saving!"
                });
            } else {
                return cb(null);
            }
            //  res.end();
        });
    } else {
       return cb(null);
        
    }
}

function uploadDocumentInfo(docNoArray, project) {
    docInfoGenerator.findDocuments(docNoArray, project, function (err, docs) {
        var msg = '';
        if (err && err.code != 11000) {
            msg = 'Error while uploading document info!>' + JSON.stringify(err);
            C.logger.info('err', err);
        } else {
            msg = 'Document info has been inserted successfully!';
        }
        var id = (new Date()).toLocaleTimeString();
        for (var i = 0; i < connections.length; i++) {
            connections[i].sseSend(id, msg);
        }
    });
    return;
}

function buildRegex(prop) {
    var tempRegex = '<' + prop + '>([\\s\\S]*?)<';
    return new RegExp(tempRegex, 'g');
}
module.exports = router;