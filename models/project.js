var mongoose = require('mongoose');
var async = require('async');
var projectSchema = mongoose.Schema({
    "name": {
        type: String,
        default: null,
        required: true
    },
    "dataset":{
        type: String,
        default : null,
        required : true
    },
    "docno_tag":{
        type:  String,
        default :"DOCNO",
        required: true
    },
    "text_tag":{
        type: String,
        default :"TEXT",
        required: true
    },
    "topic_file":{
        type: String
    },
    "create_pool":{
        type: Boolean,
        default :true
    },
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "tracks" });

var Projects = module.exports = mongoose.model('tracks', projectSchema);
module.exports.findAndUpdate = function(projectid, cb){
    console.log('Update ===',projectid);
    Projects.collection.findOneAndUpdate({name:projectid}, {$set:{create_pool: false}},cb);
};
module.exports.getTrackDetail = function(trackid, cb){
    Projects.aggregate([
        {
            $match:{
                name :trackid
            },
        },
        {
            $project:{
                track:{
                    name :"$name",
                    topic_file : "$topic_file",
                    dataset:"$dataset",
                    docno_tag :"$docno_tag",
                    text_tag :"$text_tag",
                    createddate : { $dateToString: { format: "%d/%m/%Y %H:%M", date: "$createddate" } }
                }
            }
        }
    ],cb);
}