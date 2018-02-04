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
}, { collection: "topics" });

var Topics = module.exports = mongoose.model('topics', topicSchema);

module.exports.createTopics = function(topicItems, callback) {

    var topicids = [];
    topicItems.forEach(element => {
        topicids.push(element.topic_id);
    });
    
    Topics.collection.remove({ topic_id :{ $in : topicids}}, function(err, docs){
        if(err){
            C.logger.info('Error while deleting topics');
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
module.exports.mapRegex =  function(m, field, tpc){
    
    if(field =='num')    
        C.logger.info(field,'=',m[1]);
    
        if(typeof(tpc) == "undefined"){
            tpc = new Topics();
        }
        switch (field) {
            case 'num':
                tpc.topic_id = m[1] ? m[1].replace(/Number:/g,'').trim() : m[1];
                return tpc;
            case 'title':
                tpc.title = m[1] ? m[1].trim() : m[1];
                return tpc;
            case 'desc':
                tpc.description = m[1] ? m[1].replace(/Description:/g,'').trim() : m[1];
                return tpc;
            case 'narr':
                tpc.narrative = m[1] ? m[1].replace(/Narrative:/g,'').trim() : m[1];
                return tpc;
            default:;
        }
        
        return tpc;
}