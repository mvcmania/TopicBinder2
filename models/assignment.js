var mongoose = require('mongoose');
var mail = require('./mail');
var User = require('./user');
var PROJ = require('./project');
var async = require('async');
var Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
var assignSchema = mongoose.Schema({
    "is_related": {
        type: Number,
        default: 2 //2 :not started, 1: related, 0: not related
    },
    "topic_id": {
        type: Number,
        default: null,
        required: true
    },
     "pool_id": {
        type: ObjectId,
        default: null,
        required: true
    },
    "user_id": {
        type: ObjectId,
        default: null,
        required: true
    },
    "project": {
        type: String,
        default: null,
        required: true
    },
    "assigned_date": {
        type: Date,
        default: Date.now
    },
    "update_date":{
        type: Date
    }

}, {
    collection: "assignments"
});
var Assign = module.exports = mongoose.model('assignments', assignSchema);
module.exports.createAssignments = function(assignments, callback) {
    async.waterfall([
        function(next){
            Assign.collection.insertMany(assignments, function(err, docs){
                    if(err){
                        next(err);
                    }else{
                        let assignment = assignments[0];
                        var mailData = {
                            user : null,
                            count: docs.insertedCount,
                            project: assignment.project,
                            topic : assignment.topic_id,
                        }
                        next(null, mailData, assignment);
                        /* Projects.findAndUpdate(assignment.project, function(err, proj){
                            proj.create_pool = false;
                            proj.save();
                        }); */
                    }
                });
        },
        function(mailData, assignment, next){
            User.getUserById(assignment.user_id, function(err, userRecord){
                if(err){
                    C.logger.info('Error on user query');
                    next(err);
                }else{
                    mailData.user = userRecord;
                    mail.sendEmail(userRecord.email, mailData, 'TopicBinder : Topics assigned!', 'assignmentnotification', function(err, info){
                        if(err){
                            next(err);
                        }else{
                            next(null, assignment);
                        }
                    });
                }
            });
        },
        function( assignment, next){
            C.logger.info('Project update', PROJ);
            PROJ.findAndUpdate(assignment.project, next);
        }

    ], callback);
   
}
module.exports.getDistinctValues = function(userid, distinctCol, callback) {
    Assign.distinct(distinctCol, { "user_id": mongoose.Types.ObjectId(userid) }, callback);
}
module.exports.getAssignmentSummary = function(tpids, callback) {

    Assign.aggregate([{
            $match: {
                "topic_id" :{$in :tpids}
            }
        },
        {
            $lookup: {
                "from": "pools",
                "localField": "pool_id",
                "foreignField": "_id",
                "as": "pool"
            }
        },
        {
            $project: {
                "topicid": "$pool.topic_id",
                "isRelated": "$is_related"
            }
        },
        {
            $group: {
                _id: "$topicid",
                count: {
                    $sum: 1
                },
                notStartedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$isRelated', 0]
                        }, 1, 0]
                    }
                },
                relatedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$isRelated', 1]
                        }, 1, 0]
                    }
                },
                notRelatedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$isRelated', 2]
                        }, 1, 0]
                    }
                }
            }
        }
    ], callback);
    //User.findOne(query, callback);
}
module.exports.getTopicAssignmentSummary = function(projectid, topicid, callback) {
    C.logger.info(projectid);
    C.logger.info(typeof(topicid));
    Assign.aggregate([{
            $match: {
                $and:[
                    {"topic_id": parseInt(topicid)},
                    {"project": projectid},
                ]
            }
        },
        {
            $lookup: {
                "from": "pools",
                "localField": "pool_id",
                "foreignField": "_id",
                "as": "pool"
            }
        },
        {
            $group: {
                _id: "$user_id",
                count: {
                    $sum: 1
                },
                notStartedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$is_related', 2]
                        }, 1, 0]
                    }
                },
                relatedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$is_related', 1]
                        }, 1, 0]
                    }
                },
                notRelatedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$is_related', 0]
                        }, 1, 0]
                    }
                }
            }
        },
        {
            $lookup: {
                "from": "users",
                "localField": "_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $project: {
                "user": {
                    name: "$user.name",
                    email: "$user.email",
                    color: "$user.color"
                },
                "count": "$count",
                "_id": "$_id",
                "notStartedCount": "$notStartedCount",
                "relatedCount": "$relatedCount",
                "notRelatedCount": "$notRelatedCount"
            }
        }
    ], callback);
};
module.exports.getSpecificUserAssignmentSummary = function(userid, projectid, relation, skp, callback) {
    var relationParam = parseInt(relation);
    var skip = skp ? parseInt(skp) : 0;
    console.log('Skip = ',skip);
    async.waterfall([
        function(next){
            Assign.count({ "user_id": mongoose.Types.ObjectId(userid), "project": projectid, "is_related" : relationParam}, function(err, cnt){
                var pagination ={
                    "prev": {
                        "disabled": skip - 20 <0 ? true : false,
                        "skip": skip - 20
                    },
                    "next": {
                        "disabled": skip + 20 == cnt || cnt <=20 ? true : false,
                        "skip": skip + 20
                    },
                    "last": (cnt-20 <= 20 ? 0 : cnt-20)
                }
                next(null, pagination);
            });
        },
        function(pagination, next){
            Assign.aggregate([{
                    $match: { "user_id": mongoose.Types.ObjectId(userid), "project": projectid, "is_related" : relationParam}
                },
                {
                    $sort:{"topic_id":1}
                },
                {
                    $skip:skip
                }, 
                {
                    $limit:20
                },
                {
                    $lookup: {
                        "from": "pools",
                        "localField": "pool_id",
                        "foreignField": "_id",
                        "as": "pool"
                    }
                },
                { $sort: { "pool.index": 1 } },
                {
                    $project: {
                        "topic": {
                            "_id": "$topic_id",
                            "topicid": "$pool.topic_id",
                            "document": "$pool.document_id",
                            "searchEngine": "$pool.search_engine_id",
                            "score": "$pool.score",
                            "index": "$pool.index"
                        },
                        "isRelated": "$is_related",
                        "assignedDate": { $dateToString: { format: "%d/%m/%Y %H:%M", date: "$assigned_date" } },
                        "_id":"$_id"

                    }
                }
            ], function(err, dc){
                C.logger.info('dc',dc);
                var wholeData = {
                    records : dc,
                    pagination : pagination
                }
                next(err, wholeData);
            });
        }
    ], callback);
    
    
}
module.exports.getAssignmentById = function(assignment_id, callback) {
    Assign.aggregate([{
            $match: { "_id": mongoose.Types.ObjectId(assignment_id) }
        },
        {
            $lookup:{
                "from": "pools",
                "localField": "pool_id",
                "foreignField": "_id",
                "as": "pool"
            }
        },
        {
            $lookup: {
                "from": "documents",
                "localField": "pool.document_id",
                "foreignField": "document_no",
                "as": "doc"
            }
        },
        {
            $lookup:{
                "from": "tracks",
                "localField": "project",
                "foreignField": "name",
                "as": "proj"
            }
        },
         { 
            $unwind: {
                path : "$doc",
                includeArrayIndex :"0",
                preserveNullAndEmptyArrays : true
            }
        },
        { 
            $unwind: {
                path : "$proj"
            }
        },
        {
            $lookup: {
                "from": "topics",
                "localField": "topic_id",
                "foreignField": "topic_id",
                "as": "topic"
            }
        },
        {
            $unwind: {
                path : "$topic",
                includeArrayIndex :"0",
                preserveNullAndEmptyArrays : true
            }
        }, 
        {
            $project: {
                "topic": {
                    "_id": "$topic._id",
                    "topic_id": "$topic.topic_id",
                    "title": "$topic.title",
                    "description": "$topic.description",
                    "narrative": "$topic.narrative"
                },
                "project":{
                    "name":"$proj.name",
                    "dataset":"$proj.dataset",
                    "docno_tag":"$proj.docno_tag",
                    "text_tag":"$proj.text_tag"
                },
                "document": {
                    "_id": "$doc._id",
                    "document_no": "$doc.document_no",
                    "document_file": "$doc.document_file"
                },
                "assignment":{
                    "_id":"$_id",
                    "is_related": "$is_related",
                    "document_no" :"$pool.document_id",
                    "project": "$pool.project",
                    "index" : "$pool.index",
                    "assignedDate": { $dateToString: { format: "%d/%m/%Y %H:%M", date: "$assigned_date" } }

                }
                
            }
        }
    ], callback);
}
module.exports.updateRelation = function(assignment_id, relation, callback){
    Assign.collection.update({ "_id" : mongoose.Types.ObjectId(assignment_id) },{ $currentDate : { "update_date":true},$set : { "is_related" : parseInt(relation)}}, callback)
}
module.exports.getUserAssignmentSummary = function(userid, projectid, callback) {
    C.logger.info(userid);
    Assign.aggregate([{
            $match: { "user_id": mongoose.Types.ObjectId(userid), "project" :projectid}
        },
        {
            $group: {
                _id: "$project",
                topicSet: { $addToSet: '$topic_id'},
                count: {
                    $sum: 1
                },
                notStartedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$is_related', 2]
                        }, 1, 0]
                    }
                },
                relatedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$is_related', 1]
                        }, 1, 0]
                    }
                },
                notRelatedCount: {
                    $sum: {
                        $cond: [{
                            $eq: ['$is_related', 0]
                        }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                "count": {
                    $size : "$topicSet"
                },
                "_id": "$project",
                "notStartedCount": "$notStartedCount",
                "relatedCount": "$relatedCount",
                "notRelatedCount": "$notRelatedCount"
            }
        }
    ], callback);
};
module.exports.exportQrel = function(projectid, callback){
    Assign.aggregate([
        {
            $match :{
                "project":projectid,
                $or:[
                    {"is_related":1},
                    {"is_related":0}
                ]
            }
        },
        {
            $lookup:{
                from: "pools",
                localField: "pool_id",
                foreignField: "_id",
                as: "pools"
            }
        },
        {
            $unwind :{
                path: "$pools"
            }
        },
        {
            $project:{
                _id : "$pools.topic_id",
                searchEngine : "$pools.search_engine_id",
                document_id: "$pools.document_id",
                isrelated : "$is_related"
            }
        }
    ],callback);
}