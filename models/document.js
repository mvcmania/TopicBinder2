var mongoose = require('mongoose');
var docSchema = mongoose.Schema({
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
module.exports.mapRegex =  function(m, field, tpc){
    
    
        if(typeof(tpc) == "undefined"){
            tpc = new Docs();
        }
        switch (field) {
            case 'DOCNO':
                tpc.document_no = m[1] ? m[1].trim() : m[1];
                return tpc;
            default:;
        }
        
        return tpc;
}