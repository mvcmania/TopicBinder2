var mongoose = require('mongoose');
var poolSchema = mongoose.Schema({
    "topic_id": {
        type: Number,
        default: null,
        required: true
    },
    "document_id": {
        type: String,
        default: null,
        required: true
    },
    "index": {
        type: Number,
        default: null
    },
    "score": {
        type: mongoose.Schema.Types.Decimal128,
        default: null
    },
    "search_engine_id": {
        type: String,
        default: null,
        required: false
    },
    "is_assigned": {
        type: Boolean,
        default: false,
        required: false
    },
    "project":{
        type : String,
        trim : true,
        default : null,
        required :true
    },
    "unique_id":{
        type: String,
        default: null,
        unique : true
    },
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "sorguHavuzu" });
/* poolSchema.path('score').get(function(num) {
    return 
});
poolSchema.path('score').set(function(num) {
    return (num * 100);
}); */
var Pools = module.exports = mongoose.model('sorguHavuzu', poolSchema);
module.exports.createPoolItems = function(poolItems, callback) {
        populateUniqueId(poolItems);
        Pools.collection.insertMany(poolItems,{ordered:false},callback);      
}
module.exports.findByQuery =  function(query, callback){
     Pools.collection.find(query,callback);
}
module.exports.getTopics = function(topicId, projectid, nofRec,callback) {
    var query = {"topic_id":topicId,"is_assigned":false};
    Pools.find(query,{},{limit:parseInt(nofRec)},callback);
    /* Pools.aggregate([
        { $match : { "topic_id" : parseInt(topicId), "is_assigned" : false} },
        { $group : { _id : "$topic_id", topicid : { $first : "$_id"}, count :{ $sum :1 }   } },
        { $limit : parseInt(nofRec)},
        { $project : { "_id" :"$topicid" , "uniqueid" : "$_id" , "count" : "$count"}}
    ],callback); */
}
/*
not started  - bg-teal
in progress - bg-yellow
success : bg-green
*/
module.exports.getTopicsSummary = function(projectid,callback) {
    // Get the unique topic numbers
    //Pools.find({"project": projectid,"topic_id":{$ne:null}}).distinct("topic_id",function(err, docs){
         Pools.aggregate([
            {
                $match:{
                    "project":projectid
                }
            },
            {
                $group: {
                    _id :"$topic_id",
                    actualCount:{
                        $sum:1
                    },
                    projects: {
                        $addToSet : "$project"
                    }
                }
            },
            {
                $lookup : {
                    from: "atamalar",
                    localField: "_id",
                    foreignField: "topic_id",
                    as: "assigns"
                } 
            },
            {
                $unwind : {
                    path : "$assigns",
                    preserveNullAndEmptyArrays : true
                }
            },
            {
                    $group:{
                        _id :"$_id",
                        project :{
                            $first : "$assigns.project"
                        },
                        count:{
                            $max: "$actualCount"
                        },
                        relatedCount :{
                            $sum: {
                            $cond: [{
                                $eq: ['$assigns.is_related', 1]
                            }, 1, 0]
                        }
                        },
                        notRelatedCount :{
                            $sum: {
                            $cond: [{
                                $eq: ['$assigns.is_related', 0]
                            }, 1, 0]
                        }
                        },
                        notStartedCount :{
                            $sum: {
                            $cond: [{
                                $eq: ['$assigns.is_related', 2]
                            }, 1, 0]
                        }
                        }
                    }
            },
            {
                $project:{
                    topic :"$_id",
                    project :"$project",
                    count:"$count",
                    remains : {
                      /* $cond:[{$eq :["$assignCount",0]},
                        0,
                        { */$subtract :[
                            "$count",{ $add : ["$relatedCount","$notRelatedCount","$notStartedCount"]}
                        ]/* }
                      ] */
                    },
                    inProgressCount : {
                        $add : ["$relatedCount","$notRelatedCount"]
                    },
                    relatedCount : "$relatedCount",
                    notRelatedCount : "$notRelatedCount",
                    notStartedCount :"$notStartedCount"
                }
            },
            {
                $project:{
                    topic :"$topic",
                    project :"$project",
                    count :"$count",
                    remains :"$remains",
                    relatedCount :"$relatedCount",
                    notRelatedCount :"$notRelatedCount",      
                    notStartedCount :"$notStartedCount",    
                    status :{
                     $cond:[{$eq:["$inProgressCount","$count"]},
                         "bg-green",
                          {
                            $cond:[{ $or:[{$eq:["$notStartedCount","$count"]},{$eq:["$remains","$count"]}]},
                              "bg-red",
                              "bg-yellow"
                           ]
                          }
                     ]
                    }     
                 }
            }
        
        ], callback);
    //});
   

    //User.findOne(query, callback);
}
module.exports.getDistinctValues =  function(distinctCol,callback){
    Pools.find().distinct(distinctCol,callback);
}
module.exports.getTopicByNumber =  function(topicid,callback){
    var query = {'topic_id':topicid};
    Pools.findOne(query,callback);
}
module.exports.updateTopicsByUniqueId = function(idArray, isaAssigned, callback){
    var query = { "_id" : { $in: idArray}};
    var upt =  { $set : {"is_assigned": (isaAssigned ? isaAssigned : false)} };
    var opt = {multi : true};
    Pools.update(query , upt, opt, callback);
}
function populateUniqueId (poolItems){
    if(poolItems.length > 0){
        poolItems.forEach(element => {
            element.unique_id = element.project+'_'+element.topic_id+'_'+element.document_id
        });
    }
}