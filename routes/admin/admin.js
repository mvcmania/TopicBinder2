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
var csv = require('fast-csv');
var docInfoGenerator = require('./documentInfo');
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: (process.env.PORT || 5000) });
var datasetPath = path.join(__dirname, '../../', C.datasetPath);
router.all('/admin/api(*)', function(req, resp, next) {
    C.logger.info('Admin api put');
    api(req, resp, next);
});
router.get('/', function(req, res) {
    async.parallel({
        users: function(next) {
            User.pullNonAdmins(next);
        },
        projects: function(next) {
            Project.find().distinct('name', next);
        },
        datasets: function(next) {
            fse.readdir(datasetPath, next);
            //next(null, ['TREC5','TREC6']);
        }
    }, function(err, results) {
        res.render('dashboard', { pools: {}, users: results['users'], projects: results['projects'], datasets: results['datasets'] });
    });

});
router.get('/admin/topicsummary', function(req, res, next) {

    C.logger.info('Topic Summary', req.url);
    var projectid = req.query.projectid;
    if (projectid) {
        async.waterfall([
            function(next) {
                Pool.getTopicsSummary(projectid, next);
            }
        ], function(err, result) {
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        });

    } else {
        //var msg ={'message':'Projectid can not be blank and so on!'};
        res.send(400, { status: 400, data: null, message: "Projectid can not be blank and so on!" });
    }

});
router.post('/admin/assign', function(req, res, next) {
    async.waterfall([
        function(cb) {
            Topic.validateTopic(req.body.topicid, function(err, doc) {
                if (!err && doc) {
                    cb(null);
                } else {
                    cb({ "message": "Topic not found" }, null);
                }
            });
        },
        function(cb) {
            Pool.getTopics(req.body.topicid, req.body.projectid, req.body.numberoftopic, function(err, res1) {
                var assignItemArr = [];
                var uniqueidSet = [];
                if (!err && res1 && res1.length > 0) {
                    res1.forEach(function(element) {
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
                    cb({ "message": "Error while getting topics to assign", "data": err }, null);
                }
                cb(null, assignItemArr, uniqueidSet);
            });
        },
        function(assignItemArr, uniqueidSet, cb) {
            //C.logger.info('Assignment err',assignItemArr);
            Assign.createAssignments(assignItemArr, function(err, res2) {
                cb(err, uniqueidSet);
            });
        },
        function(uniqueidSet, cb) {
            Pool.updateTopicsByUniqueId(uniqueidSet, true, function(err, res3) {
                var resultMain = { "topic_id": req.body.topicid, "result": res3 };
                cb(null, resultMain);
            });
        }
    ], function(err, results) {
        if (err) {
            res.status(400).send({ status: 400, data: err.data, message: err.message });
        } else {
            res.status(200).send({ status: 200, data: null, message: "Assigned Successfully!" });
        }
    });

});
router.post('/admin/upload', function(req, res, next) {

    var context = req || this,
        busboy = new Busboy({ headers: context.headers });

    var fileType = '';

    var topicFileRows = '';
    var projectName = '';
    var dataset = '';
    var rowCount = 0;
    var prop = ['num', 'title', 'desc', 'narr'];
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        C.logger.info('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

        file.on('data', function(data) {
            if (fieldname.startsWith('topicFile')) {
                topicFileRows += data;
            }
            C.logger.info('Data with read data : file name :' + fieldname);
        });
        file.on('end', function() {
            C.logger.info('End with read data : file name :' + fieldname);

        });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

        if (fieldname == 'project-name') {
            projectName = inspect(val) ? inspect(val).replace(/'/g, '') : inspect(val);
        }
        if (fieldname == 'dataset') {
            dataset = inspect(val) ? inspect(val).replace(/'/g, '') : inspect(val);
        }
        C.logger.info('FieldName', fieldname);
        C.logger.info('inspect(val)', inspect(val));
    });
    busboy.on('finish', function() {
        C.logger.info('Done parsing form!');
        async.waterfall([
                function(cb) {
                    Project.create({ "name": projectName, "dataset": dataset }, function(err, res) {
                        cb(err);
                    });
                },
                function(cb) {

                    uploadTopicFile(topicFileRows, res, prop, cb);
                },
                function(cb) {
                    var projectPath = 'projects/' + projectName + '/run';
                    fse.ensureDir(projectPath, cb);
                }
            ],
            function(err) {
                if (err) {
                    C.logger.info("Error occured..on bulk pool saving...", err);
                    res.status(400).send({ status: 400, data: err, message: "Error occured on bulk saving!" });
                } else {

                    res.status(200).send({ status: 200, data: null, message: "Redirect!" });
                }
            });

    });

    req.pipe(busboy);
});
router.post('/admin/assignmentsummary', function(req, res, next) {
    Assign.getTopicAssignmentSummary(req.query.projectid, req.query.topicid,
        function(err, result) {
            var rt;
            if (err)
                rt = err;
            else
                rt = result;
            res.send(rt, {
                'Content-Type': 'application/json'
            }, 200);

        });
});
router.post('/admin/createpool', Tools.checkTrackIdExists, function(req, res, next) {
    //res.status(200).send(hbs.handlebars.compile('<p>ECHO: {{message}}</p>'));
    C.logger.info('Admin create pool =', req.body);
    C.logger.info('Admin create pool rowCount=', res.locals.rowCount);
    res.locals.runRoot = path.join(__dirname, res.locals.runRoot);
    var inputFileTempsRows = [];

    const totalCount = res.locals.rowCount;
    async.waterfall([
        function(cb) {
            fse.readdir(res.locals.runRoot, cb);
        },
        function(files, cb) {

            var paths = files.map(function(file) { return path.join(res.locals.runRoot, file) });
            paths.forEach(function(path, key) {

                //async.each(stats, function(stat, cb){
                //if(!stat.isDirectory()){
                const tempInputFileTempsRows = [];
                const csvStream = csv({ delimiter: "\t" });
                const fileStream = fse.createReadStream(path, { encoding: 'UTF-8', autoClose: true }).pipe(csvStream);

                C.logger.info('Delimiter', req.body.delimiter);
                var onData = function(row) {
                    tempInputFileTempsRows.push(row);
                    if (tempInputFileTempsRows.length == totalCount) {
                        inputFileTempsRows = inputFileTempsRows.concat(tempInputFileTempsRows);
                        csvStream.emit('doneParsing');
                    }
                }

                csvStream.on("data", onData);
                csvStream.on("end", function() {
                    C.logger.info('End');
                    /*  if(key +1 == paths.length){
                         C.logger.info('End2');
                         cb(null, inputFileTempsRows)
                     } */
                })
                csvStream.on('error', cb);
                //custom event
                csvStream.on('doneParsing', function() {

                    C.logger.info('got ' + req.body.rowCount + ' rows', inputFileTempsRows);
                    /*  fileStream.close(); */
                    csvStream.removeListener('data', onData);
                    if (key + 1 == paths.length) {
                        C.logger.info('doneParsing');
                        cb(null, inputFileTempsRows)
                    }
                });
                //}
                //});

            });
        },
        function(inputRows, cb) {

            uploadInputFile(inputRows, req.body.project, cb);
        }
    ], function(err) {
        if (err) {
            C.logger.error('Error creating pool', err);
            res.status(400).send('Error occured while creating pools!');
        } else {
            res.status(200).send('Pool created success!');
        }

    });
    /* var readableStream = fse.createReadStream();
    var DATA_ROOT = path.join(__dirname,'../../projects/'+req.body.project)
    req.body['layout']= false;
    res.render('partials/createpool',req.body); */
});
router.get('/admin/exportqrel', function(req, res, next) {
    var project = req.query.project;
    Assign.exportQrel(project, function(err, docs) {
        var myData = [];
        if (err) {
            myData.push({ "Error": "Error Occured while generating qrel!" });
        } else {
            myData = docs;
        }
        var now = new Date();
        var formatDate = dateFormat(now, "ddmmyyyy_HH:MM:ss");
        csv = json2csv({ data: myData, del: ' ', quotes: '', hasCSVColumnTitle: false });
        res.setHeader('Content-disposition', 'attachment; filename=qrel.' + project + '_' + formatDate);
        res.setHeader('Content-type', 'text/plain');
        res.end(csv);
    });
});

function postProcessAssignAgg(aggResult) {
    var assMap = {};
    for (var rs in aggResult) {
        assMap[parseInt(aggResult[rs]._id)] = aggResult[rs];
    }
    return assMap;
}

function postProcessSummary(assMap, aggResult) {
    for (var r in aggResult) {
        var item = assMap[aggResult[r].topic_id];
        if (item) {
            aggResult[r]['remains'] = aggResult[r].count - item.count;
            var tmpTotal = item.relatedCount + item.notRelatedCount;
            if (aggResult[r].count == tmpTotal) {
                aggResult[r]['status'] = 'bg-green';
            } else if (item.notStartedCount > 0) {
                aggResult[r]['status'] = 'bg-yellow';
            }
        } else {
            aggResult[r]['remains'] = aggResult[r].count;
        }
    }
}

function uploadInputFile(recordsArray, project, dataset, cb) {

    var pool_array = [];
    var doc_array = [];
    recordsArray.forEach(el => {
        //C.logger.info(el);
        var plItem = new Pool({
            "topic_id": el[0],
            "document_id": el[2],
            "index": parseInt(el[3]),
            "score": mongoose.Types.Decimal128.fromString(el[4]),
            "search_engine_id": el[5],
            "is_assigned": false,
            "project": project
        });
        doc_array.push(el[2]);

        pool_array.push(plItem);
    });


    if (pool_array.length > 0) {
        Pool.createPoolItems(pool_array, function(err, docs) {
            //Error code : 11000 (duplicate error no need to send 400)
            if (err && err.code != 11000) {
                C.logger.info("Error occured..on bulk pool saving...", err);
                cb({ "message": "Error occured on bulk saving!" });
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
        Topic.createTopics(topics, function(err, tps) {
            if (err) {
                C.logger.info("Error occured..on bulk topic saving...", err);

                cb({ "message": "Error occured on bulk topic saving!" });
            } else {
                cb(null);
            }
            //  res.end();
        });
    } else {
        cb(null);
        //res.status(400).send({ status: 400, data: null, message: "File could be empty or in different format! Please specify the correct properties!" });
    }
}

function uploadDocumentInfo(docNoArray, project) {
    docInfoGenerator.findDocuments(docNoArray, project, function(err, docs) {
        var msg = '';
        if (err) {
            msg = 'Error while uploading document info!';
        } else {
            msg = 'Document info has been inserted successfully!';
        }
        wss.clients.forEach(function each(client) {
            client.send(msg);
        });
    });
    return;
}

function buildRegex(prop) {
    var tempRegex = '<' + prop + '>([\\s\\S]*?)<';
    return new RegExp(tempRegex, 'g');
}
module.exports = router;