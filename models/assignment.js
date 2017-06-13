var mongoose = require('mongoose');
var assignSchema = mongoose.Schema({
    "document_id": {
        type: String,
        default: null,
        required: true
    },
    "is_related": {
        type: Boolean,
        default: false
    },
    "topic_id": {
        type: Number,
        default: null,
        required: true
    },
    "user_id": {
        type: String,
        default: null,
        required: true
    },
    "project":{
        type: String,
        default:null,
        required: true
    }
}, { collection: "atamalar" });
var Assign = module.exports = mongoose.model('atamalar', assignSchema);
module.exports.createAssignments = function(assignments, callback) {
    Assign.collection.insertMany(assignments, callback);
}
module.exports.getAssignmentSummary = function(projectid,callback) {
    Assign.aggregate([
        {$match:{ "project" : projectid }},
        {$group: {
            _id: "$topic_id",
            count: { $sum: 1 }
        }}
    ],callback);
    //User.findOne(query, callback);
}
module.exports.getTopicAssignmentSummary = function(projectid, topicid, callback){
    Assign.aggregate([
        {$match : {"project":projectid, "topic_id":topicid}},
        {$group:{
            _id :"$user_id",
            count:{$sum :1}
        }},
       {$lookup : {"from" :"kullanicilar","localField":"_id","foreignField":"id","as":"user"}},
       {$unwind:"$user"},
       {$project:{"user":"$user.name","count":"$count","_id":"$_id"}} 
    ],callback);
};
