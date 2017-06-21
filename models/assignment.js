var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
var assignSchema = mongoose.Schema({
    "is_related": {
        type: Number,
        default: 0 //0 :not started, 1: related, 2: not related
    },
    "topic_id": {
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
    }
}, {
    collection: "atamalar"
});
var Assign = module.exports = mongoose.model('atamalar', assignSchema);
module.exports.createAssignments = function(assignments, callback) {
    Assign.collection.insertMany(assignments, callback);
}
module.exports.getDistinctValues = function(userid, distinctCol, callback) {
    Assign.distinct(distinctCol, { "user_id": mongoose.Types.ObjectId(userid) }, callback);
}
module.exports.getAssignmentSummary = function(projectid, callback) {
    Assign.aggregate([{
            $match: {
                "project": projectid
            }
        },
        {
            $lookup: {
                "from": "sorguHavuzu",
                "localField": "topic_id",
                "foreignField": "_id",
                "as": "topic"
            }
        },
        {
            $project: {
                "topicid": "$topic.topic_id",
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
    console.log(projectid);
    console.log(typeof(topicid));
    Assign.aggregate([{
            $match: {
                "project": projectid
            }
        },
        {
            $lookup: {
                "from": "sorguHavuzu",
                "localField": "topic_id",
                "foreignField": "_id",
                "as": "topic"
            }
        },
        {
            $match: {
                "topic.topic_id": parseInt(topicid),
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
                            $eq: ['$is_related', 0]
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
                            $eq: ['$is_related', 2]
                        }, 1, 0]
                    }
                }
            }
        },
        {
            $lookup: {
                "from": "kullanicilar",
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
module.exports.getSpecificUserAssignmentSummary = function(userid, projectid, callback) {
    Assign.aggregate([{
            $match: { "project": projectid, "user_id": mongoose.Types.ObjectId(userid) }
        },
        {
            $lookup: {
                "from": "sorguHavuzu",
                "localField": "topic_id",
                "foreignField": "_id",
                "as": "topic"
            }
        },
        { $sort: { "topic.index": 1 } },
        {
            $project: {
                "topic": {
                    "_id": "$topic_id",
                    "topicid": "$topic.topic_id",
                    "document": "$topic.document_id",
                    "searchEngine": "$topic.search_engine_id",
                    "score": "$topic.score",
                    "index": "$topic.index"
                },
                "isRelated": "$is_related",
                "assignedDate": { $dateToString: { format: "%d/%M/%Y %H:%M", date: "$assigned_date" } }
            }
        }
    ], callback);
}