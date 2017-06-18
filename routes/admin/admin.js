var express = require('express');
var exphbs = require('express-handlebars');
var router = express.Router();
var Busboy = require('busboy');
var async = require('async');
var Pool = require('../../models/pool');
var User = require('../../models/user');
var Assign = require('../../models/assignment');
var mongoose = require('mongoose');


router.get('/', function(req, res) {
    /*Pool.getTopics(function(err, pools) {
        res.render('dashboard', { pools: pools });
    });
*/  /*Pool.getDistinctTopicIds(function(err,ids){
        console.log(ids);
    });*/
    
    async.parallel({
        users: function(next){
            User.pullNonAdmins(function(err, res1){
                //console.log('users',result);
                next(null,res1);
            });
        },
        projects : function(next){
            Pool.getDistinctValues('project',function(err, res2){
                next(null,res2);
            })
        }
    },function(err,results){
         res.render('dashboard', { pools: {},users: results['users'] , projects : results['projects']});
    });
    
});
router.get('/topicsummary', function(req, res, next) {
    var projectid = req.query.projectid;
    if(projectid){
        async.waterfall([
            function(next){
                
                 Assign.getAssignmentSummary(projectid, function(err, res1) {
                    if(err)
                        next(err, null);
                    else{
                        //console.log('assing',res1);
                        var assMap = postProcessAssignAgg(res1);
                        next(null, assMap);
                    }                  
                    
                });
            },
            function(assMap, next){
                 Pool.getTopicsSummary(projectid, function(err, res2) {

                     if(assMap)
                     postProcessSummary(assMap, res2);
                     next(null, res2);
                });
            }
        ],function(err, result){
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        });
       
    }else{
        //var msg ={'message':'Projectid can not be blank and so on!'};
        res.send(400, {status: 400, data: null, message: "Projectid can not be blank and so on!"});
    }
    
});
router.post('/assign', function(req, res, next) {
    async.waterfall([
        function(next){
            Pool.getTopics(req.body.topicid, req.body.projectid, req.body.numberoftopic, function(err, res1){
                var assignItemArr = [];
                var tpid= [];
                
                for(var tp in res1){
                    
                    var assignItem = new Assign({
                        topic_id : mongoose.Types.ObjectId(res1[tp]._id),//res1[tp].topic_id,
                        user_id : mongoose.Types.ObjectId(req.body.recipient),
                        project : res1[tp].project
                    });
                    tpid.push(res1[tp]._id);
                    assignItemArr.push(assignItem);
                }
                next(null,assignItemArr,tpid);
            });
        },
        function(assignItemArr, tpid, next){
             Assign.createAssignments(assignItemArr, function(err, res2){
                next(null, tpid);
            });
        },
        function(tpid, next){
            Pool.updateTopicsByNumber(tpid, true, function(err,res3){
                var resultMain = { "topic_id":req.body.topicid , "result" : res3};
                next(null, resultMain);
            });
        }
    ],function(err, resMain){
             res.send(resMain, {
                'Content-Type': 'application/json'
                }, 200);
    });

});
router.post('/upload', function(req, res, next) {
    var resMsj ='File has been posted!';
    //res.setHeader('Content-Type','text/plain');
    //res.write(resMsj);
     var context = req || this,
     busboy  = new Busboy({ headers: context.headers });
    //var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        var all_rows = '';
        file.on('data', function(data) {
            all_rows += data;
        });
        file.on('end',function(data){
         console.log('Finished with read data : file name :'+filename);
         //res.write('Finished with read data : file name :'+filename);
          csv_parse(all_rows,res,filename);
        });
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      //res.write('Done parsing form!');
    });

    req.pipe(busboy);
    //res.end();
    //res.render('dashboard',{ pools: {},users: req.users});
});
router.post('/assignmentsummary',function(req, res, next){
    Assign.getTopicAssignmentSummary(req.query.projectid, req.query.topicid,
    function(err,result){
        var rt;
        if(err)
        rt = err;
        else
        rt = result;
         res.send(rt, {
                'Content-Type': 'application/json'
                }, 200);
        
    });
});
function postProcessAssignAgg (aggResult){
    var assMap ={};
    for(var rs  in aggResult){
        assMap[parseInt(aggResult[rs]._id)] = aggResult[rs];
    }
    return assMap;
}
function postProcessSummary(assMap, aggResult){
    for(var r in aggResult){
        var item = assMap[aggResult[r].topic_id];
        if(item){
            aggResult[r]['remains'] = aggResult[r].count - item.count;
            var tmpTotal = item.relatedCount + item.notRelatedCount;
            if(aggResult[r].count == tmpTotal){
                aggResult[r]['status'] = 'bg-green';
            }else if(item.notStartedCount > 0){
                aggResult[r]['status'] = 'bg-yellow';
            }
        }else{
             aggResult[r]['remains'] = aggResult[r].count;
        }
    }
}
function csv_parse(records,res, filename){
  //Split with new line
  var arr = records.split("\n");
  var pool_array=[];
  arr.map(function(val){
    var splitted = val.split("\t");
    var plItem = new Pool({
      "topic_id" : splitted[0],
      "document_id" : splitted[2],
      "index" : parseInt(splitted[3]),
      "score" :  parseInt(splitted[4]),
      "search_engine_id" : splitted[5],
      "is_assigned" : false,
      "project":filename
     });
     pool_array.push(plItem);
  });
  if(pool_array.length > 0){
      Pool.collection.insertMany(pool_array,function(err,docs){
        if(err){
            console.log("Error occured..on bulk pool saving...",err);
            
            res.send(400, {status: 400, data: err, message: "Error occured on bulk saving!"});
        }else{
            res.send(200, {status: 200, data: null, message: "Redirect!"});
        }
      //  res.end();
    });
  }
}

module.exports = router;
