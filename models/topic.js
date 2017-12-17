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

    var topicids = [];
    topicItems.forEach(element => {
        topicids.push(element.topic_id);
    });
    
    Topics.collection.remove({ topic_id :{ $in : topicids}}, function(err, docs){
        if(err){
            console.log('Error while deleting topics');
        }else{
            Topics.collection.insertMany(topicItems,callback);
        }
       
    });
}
module.exports.validateTopic = function(topicid, callback){
    Topics.findOne({topic_id : topicid},{ topic_id :1 }, callback);
}
module.exports.getTopicDetail = function(topicid , callback){
    Topics.findOne({topic_id : topicid}, callback);
}
module.exports.mapRegex =  function(m, indexMap){
   
    var rpl = new RegExp();
    //console.log('topic_id',m[3]);
     var topicItem = new Topics({
            "topic_id": m[indexMap['num']] ? m[indexMap['num']].replace(/Number:/g,'').trim() : m[indexMap['num']],
            "title": m[indexMap['title']] ? m[indexMap['title']].trim() : m[indexMap['title']],
            "description":  m[indexMap['desc']] ? m[indexMap['desc']].replace(/Description:/g,'').trim() : m[indexMap['desc']],
            "narrative":  m[indexMap['narr']] ? m[indexMap['narr']].replace(/Narrative:/g,'').trim() : m[indexMap['narr']]
        });
    return topicItem;
}