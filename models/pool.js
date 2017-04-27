var mongoose = require('mongoose');

var poolSchema = mongoose.Schema({
    "topic_id": {
        type: String,
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
    }
}, { collection: "sorguHavuzu" });

var Pools = module.exports = mongoose.model('sorguHavuzu', poolSchema);
module.exports.createPoolItems = function(poolItems, callback) {
    poolItems.save(callback);
}

module.exports.getTopics = function(callback) {
    Pools.find({}, {}, { limit: 100 }, callback);
    //User.findOne(query, callback);
}