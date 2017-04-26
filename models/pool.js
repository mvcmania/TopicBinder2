var mongoose = require('mongoose');

var poolSchema = mongoose.Schema({
    "document_id": {
        type: String,
        default: null,
        required: true
    },
    "topic_id": {
        type: String,
        default: null,
        required: true
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
});

var pools = module.exports = mongoose.model('sorguHavuzu', poolSchema);
module.exports.createPoolItems = function(poolItems, callback) {
    poolItems.save(callback);
}