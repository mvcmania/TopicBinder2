var mongoose = require('mongoose');
var async = require('async');
var Pool = require('./pool');
var Assignment = require('./assignment');
var Doc = require('./document');
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
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "projeler" });

var Projects = module.exports = mongoose.model('projeler', projectSchema);
module.exports.cleanTrack = function(projectid, cb){
    async.parallel({
        deleteProject : function(next){
            Projects.remove({name:projectid}, next);
        },
        deletePool : function(next){
            Pool.remove({project: projectid}, next);
        },
        deleteDocs : function(next){
            Doc.remove({project: projectid}, next);
        },
        deleteAssignments : function(next){
            Assignment.remove({project:projectid}, next);
        }
    }, function(err, results){
        cb(err, results);
    });
};