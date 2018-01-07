var mongoose = require('mongoose');
var projectSchema = mongoose.Schema({
    "name": {
        type: String,
        default: null,
        required: true
    },
    "createddate":{
        type:Date,
        default : Date.now
    }
}, { collection: "projeler" });

var Projects = module.exports = mongoose.model('projeler', projectSchema);