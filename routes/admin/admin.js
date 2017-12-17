var express = require('express');
var exphbs = require('express-handlebars');
var router = express.Router();
var Busboy = require('busboy');
var inspect = require('util').inspect;
var async = require('async');
var Pool = require('../../models/pool');
var Topic = require('../../models/topic');
var User = require('../../models/user');
var Assign = require('../../models/assignment');
var mongoose = require('mongoose');
var fs = require('fs');

router.get('/', function(req, res) {
    async.parallel({
        users: function(next) {
            User.pullNonAdmins(function(err, res1) {
                //console.log('users',result);
                next(null, res1);
            });
        },
        projects: function(next) {
            Pool.getDistinctValues('project', function(err, res2) {
                next(null, res2);
            })
        }
    }, function(err, results) {
        res.render('dashboard', { pools: {}, users: results['users'], projects: results['projects'] });
    });

});
router.get('/topicsummary', function(req, res, next) {
    var projectid = req.query.projectid;
    if (projectid) {
        async.waterfall([
            function(next) {

                Pool.find({"project": projectid,"topic_id":{$ne:null}}).distinct("topic_id",function(err, docs){
                    next(null, docs);
                });
            },
            function(docs, next) {

                Assign.getAssignmentSummary(docs, function(err, res1) {
                    if (err)
                        next(err, null);
                    else {
                        //console.log('assing',res1);
                        var assMap = postProcessAssignAgg(res1);
                        next(null, assMap);
                    }

                });
            },
            function(assMap, next) {
                Pool.getTopicsSummary(projectid, function(err, res2) {

                    if (assMap)
                        postProcessSummary(assMap, res2);
                    next(null, res2);
                });
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
router.post('/assign', function(req, res, next) {
    async.waterfall([
        function(cb){
            Topic.validateTopic(req.body.topicid, function(err, doc){
                if(!err && doc){
                    cb(null);
                }else{
                    cb({"message":"Topic not found"}, null);
                }
            });
        },
        function(cb) {
            Pool.getTopics(req.body.topicid, req.body.projectid, req.body.numberoftopic, function(err, res1) {
                var assignItemArr = [];
                var uniqueidSet = [];
                if(!err && res1 && res1.length > 0){
                        res1.forEach(function(element) {
                            var assignItem = new Assign({
                            pool_id: mongoose.Types.ObjectId(element._id), //res1[tp].topic_id,
                            user_id: mongoose.Types.ObjectId(req.body.recipient),
                            project: req.body.projectid,
                            topic_id : req.body.topicid

                        });
                        uniqueidSet.push(element._id);
                        assignItemArr.push(assignItem);
                    }, this);
                }else{
                    cb({"message":"Error while getting topics to assign","data":err}, null);
                }
                cb(null, assignItemArr, uniqueidSet);
            });
        },
        function(assignItemArr, uniqueidSet, cb) {
            //console.log('Assignment err',assignItemArr);
            Assign.createAssignments(assignItemArr, function(err, res2) {

                if(err){
                    cb(err,null);
                }else{
                    cb(null, uniqueidSet);
                }
            });
        },
        function(uniqueidSet,cb) {
            Pool.updateTopicsByUniqueId(uniqueidSet, true, function(err, res3) {
                var resultMain = { "topic_id": req.body.topicid, "result": res3 };
                cb(null, resultMain);
            });
        }
    ], function(err, results) {
        if(err){
            res.status(400).send({ status: 400, data: err.data, message: err.message });
        }else{
            res.status(200).send({ status: 200, data: null, message: "Assigned Successfully!" });
        }
    });

});
router.post('/upload', function(req, res, next) {
    var resMsj = 'File has been posted!';
    var context = req || this,
        busboy = new Busboy({ headers: context.headers });

    var fileType = '';
    var rows = '';
    var flName = '';
    var props = [];
    //var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        file.on('data', function(data) {
            rows += data;
        });
        file.on('end', function(data) {
            console.log('Finished with read data : file name :' + filename);
            flName = filename;
            //res.write('Finished with read data : file name :'+filename);
        });
    });
     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      /* console.log('Field [' + fieldname + ']: value: ' , inspect(val));
      console.log('fieldnameTruncated [' + fieldnameTruncated + ']');
       console.log('valTruncated [' + valTruncated + ']');
       console.log('encoding [' + encoding + ']'); */
       if(fieldname == 'fileType'){
           fileType = inspect(val) ? inspect(val).replace(/'/g,'') : inspect(val);
       }
       if(fieldname == 'prop'){
           prop = inspect(val) ? inspect(val).replace(/'/g,'').split(',') : inspect(val).prop(',');
       }
      /*  console.log('FieldName' , fieldname);
       console.log('inspect(val)' , inspect(val)); */
    });
    busboy.on('finish', function() {
        console.log('Done parsing form!');
        console.log('fileType' + fileType);
        if(fileType == 'inputFile')
            uploadInputFile(rows, res, flName);
        else if(fileType == 'topicFile')
            uploadTopicFile(rows, res, prop);
        else{
            buildRegex(prop);
            res.status(400).send({ status: 400, data: null, message: "No file type selected" });
        }
    });

    req.pipe(busboy);
    //res.end();
    //res.render('dashboard',{ pools: {},users: req.users});
});
router.post('/assignmentsummary', function(req, res, next) {
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

function uploadInputFile(records, res, filename) {
    //Split with new line
    var arr = records.split("\n");
    var pool_array = [];
    arr.map(function(val) {
        var splitted = val.split("\t");
        var plItem = new Pool({
            "topic_id": splitted[0],
            "document_id": splitted[2],
            "index": parseInt(splitted[3]),
            "score": parseInt(splitted[4]),
            "search_engine_id": splitted[5],
            //"unique_id":splitted[0]+'_'+splitted[2],
            "is_assigned": false,
            "project": filename
        });
        pool_array.push(plItem);
    });
    if (pool_array.length > 0) {
        Pool.createPoolItems(pool_array, function(err, docs){
            //Error code : 11000 (duplicate error no need to send 400)
            if (err && err.code !=11000) {
                console.log("Error occured..on bulk pool saving...",err);

                res.status(400).send({ status: 400, data: err, message: "Error occured on bulk saving!" });
            } else {
                res.status(200).send({ status: 200, data: null, message: "Redirect!" });
            }
        }); 
    }
}
function uploadTopicFile (data, res, prop){
        //new RegExp(/<top>\n\n<num>((?:[^\\<])+)<title>((?:[^\\<])+)<desc>((?:[^\\<])+)<narr>((?:[^\\<])+)/g);
        let m;
        var topics = [];
        var indexMap = getIndexMap(prop);
        var newDatadata = normalizeXml(data);
        console.log('index map',indexMap);
        var reg = buildRegex(prop);
        while ((m = reg.exec(newDatadata)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === reg.lastIndex) {
            reg.lastIndex++;
            }
            
            var topicItem = Topic.mapRegex(m, indexMap);
            topics.push(topicItem);
            //console.log(m[4]);
        }
         if(topics.length >0 ){
            Topic.createTopics(topics, function(err, tps) {
                if (err) {
                    console.log("Error occured while uploading topicss...", err);

                    res.status(400).send({ status: 400, data: err, message: "Error occured on bulk saving!" });
                } else {
                    res.status(200).send({ status: 200, data: null, message: "Redirect!" });
                }
                //  res.end();
            });
        } else{
            res.status(400).send({ status: 400, data: null, message: "File could be empty or in different format! Please specify the correct properties!" });
        }
}
 function buildRegex(prop){
     if(prop.length == 0){
         return  new RegExp(/<top>\n\n<num>((?:[^\\<])+)<title>((?:[^\\<])+)<desc>((?:[^\\<])+)<narr>((?:[^\\<])+)/g);
    }else{
        var tempRegex = '';
        prop.forEach((element,index) => {
            tempRegex += '<'+element+'>';
            /*if(index == 0){
                tempRegex +='\\n\\n';
            }else{ */
                tempRegex += '((?:[^\\<])+)';
            //}
        });
        console.log('REGEX ==',tempRegex);
        return new RegExp(tempRegex,'g');
    }
 }
 function getIndexMap (prop){
    var indexMap = {};
    var requiredFields = ['num','title','desc','narr'];
    requiredFields.forEach(element => {
        indexMap[element] = prop.indexOf(element)+1;
    });
    return indexMap;
 }
 function normalizeXml(data){
    var nm = new RegExp(/<fac>(.*)(\s\s.*)+(.*)<\/fac>/g);

    var newData = data.replace(nm,'<fac> Factory');
    console.log('New data ==',newData);
    return newData;
 }
module.exports = router;