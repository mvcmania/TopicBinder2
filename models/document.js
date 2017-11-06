var mongoose = require('mongoose');
var docSchema = mongoose.Schema({
    "document_id": {
        type: String,
        default: null,
        required: true
    },
    "document_no": {
        type: String,
        default: null,
        required: true
    },
    "document_file": {
        type: String,
        default: null,
        required: false
    }
}, { collection: "dokumanlar" });
var Docs = module.exports = mongoose.model("dokumanlar", docSchema);

module.exports.getDocById = function(docid, callback){
    Docs.findOne({ document_no : docid}, callback);
}
module.exports.insertDocuments = function(obj ,callback){
    Docs.collection.insertMany( obj, callback);
}