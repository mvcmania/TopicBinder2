var mongoose = require('mongoose');
var descriptionReplace = ' Description: ';
var numberReplace = ' Number: ';
var narrativeReplace = ' Narrative: ';
var topicSchema = mongoose.Schema({
    "description": {
        type: String,
        default: null
    },
    "narrative": {
        type: String,
        default: null
    },
    "title": {
        type: String,
        default: null
    },
    "topic_id": {
        type: Number,
        default: null
    },
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "sorgular" });

var Topics = module.exports = mongoose.model('sorgular', topicSchema);
module.exports.createTopics = function(topicItems, callback) {
    Topics.collection.insertMany(topicItems,callback);
}
module.exports.validateTopic = function(topicid, callback){
    Topics.findOne({topic_id : topicid},{ topic_id :1 }, callback);
}
module.exports.getTopicDetail = function(topicid , callback){
    Topics.findOne({topic_id : topicid}, callback);
}
module.exports.mapRegex =  function(m){
    var rpl = new RegExp();
     var topicItem = new Topics({
            "topic_id": m[1] ? m[1].replace(/Number:/g,'').trim() : m[1],
            "title": m[2] ? m[2].trim() : m[2],
            "description":  m[3] ? m[3].replace(/Description:/g,'').trim() : m[3],
            "narrative":  m[4] ? m[4].replace(/Narrative:/g,'').trim() : m[4]
        });
    return topicItem;
}