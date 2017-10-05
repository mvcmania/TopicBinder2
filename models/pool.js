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
        type: Number,
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
        type:String,
        default: false,
        required: true
    },
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "sorguHavuzu" });

var Pools = module.exports = mongoose.model('sorguHavuzu', poolSchema);
module.exports.createPoolItems = function(poolItems, callback) {
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
    Pools.find({"project": projectid,"topic_id":{$ne:null}}).distinct("topic_id",function(err, docs){
         Pools.aggregate([
            {$match : {"topic_id":{$in :docs}}},
            {$group: {
                _id: "$topic_id",
                topic_id :{ $first : "$_id"},
                count: { $sum: 1 }
            }},
            {$sort : {  "_id" :1 } },
            {$project : { "_id":"$topic_id","topic_id":"$_id", "count": "$count" ,"status":{ $literal: "bg-red" } ,"remains":{ $literal: 0 } ,"notstarted":{ $literal :0},"related":{ $literal :0},"notrelated":{$literal:0} }}
        
        ], callback);
    });
   

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