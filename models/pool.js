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
    "isrelated": {
        type: Boolean,
        default: null,
    }
});

var User = module.exports = mongoose.model('Pool', poolSchema);
module.exports.createPoolItems = function(poolItems, callback) {
    poolItems.save(callback);
}