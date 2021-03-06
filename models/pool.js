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
    "docno_projectid":{
        type: String
    },
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "pools" });
/* poolSchema.path('score').get(function(num) {
    return 
});
poolSchema.path('score').set(function(num) {
    return (num * 100);
}); */
var Pools = module.exports = mongoose.model('pools', poolSchema);
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

var summary =  function(projectid, stat, callback) {
    console.log('stat', stat);
    console.log('projectid', projectid);
    // Get the unique topic numbers
    //Pools.find({"project": projectid,"topic_id":{$ne:null}}).distinct("topic_id",function(err, docs){
         
         var summaryPipeline = [
                // Stage 1
                {
                    $match: {
                        "project": projectid
                    }
                },
        
                // Stage 2
                {
                    $group: {
                        _id :"$topic_id",
                        actualCount:{
                            $sum:1
                        },
                    }
                },
        
                // Stage 3
                {
                    $lookup: {
                        from: "assignments",
                        localField: "_id",
                        foreignField: "topic_id",
                        as: "assignsTemp"
                    }
                },
        
                // Stage 4
                {
                    $project: {
                        _id:"$_id",
                        assigns:{
                            $filter:{
                                input:"$assignsTemp",
                                as :"asg",
                                cond:{
                                    $eq:["$$asg.project",projectid]
                                }
                            }
                        },
                        actualCount:"$actualCount"
                    }
                },
        
                // Stage 5
                {
                    $unwind: {
                        path : "$assigns",
                        preserveNullAndEmptyArrays : true
                    }
                },
        
                // Stage 6
                {
                    $group: {
                        _id :"$_id",
                        proj :{
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
        
                // Stage 7
                {
                    $project: {
                        topic :"$_id",
                        count:"$count",
                        proj:"$proj",
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
        
                // Stage 8
                {
                    $project: {
                       topic :"$topic",
                       project :"$proj",
                       count :"$count",
                       remains :"$remains",
                       relatedCount :"$relatedCount",
                       notRelatedCount :"$notRelatedCount",      
                       notStartedCount :"$notStartedCount",    
                       status :{
                        $cond:[{$eq:["$inProgressCount","$count"]},
                            "bg-green",
                             {
                               $cond:[{$eq:["$remains","$count"]},
                                 "bg-red",
                                 { 
                                     $cond :[ {$eq:["$remains",0]},
                                     "bg-blue",
                                     "bg-yellow"
                                    ]
                                 }
                              ]
                             }
                        ]
                       }     
                    }
                }
        
            ];
        if(stat){
            
                // Stage 10
            summaryPipeline.push(
                {
                    $match: {
                        status : stat
                    },

                },
                {
                    $sort: {"topic":1}
                }
            );
        }else{
            
            summaryPipeline.push({
                    $group:{
                        _id:"$status",
                        statusCount :{
                            $sum:1
                        }
                    }
                });
        }
        Pools.aggregate(summaryPipeline, callback);
    //});
   

    //User.findOne(query, callback);
}

module.exports.getTopicsSummary = summary;

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