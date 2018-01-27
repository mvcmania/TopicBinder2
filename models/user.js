var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    reset_password_token:{
        type : String
    },
    reset_password_expires:{
        type: Date
    },
    isactive:{
        type: Boolean,
        default :true
    },
    avatar:{
        type:String
    }

}, {
    collection: "kullanicilar"
});

/* module.exports.setPassword = function(v, cb){
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(v, salt, cb);
    });
} */
var User = module.exports = mongoose.model('kullanicilar', userSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
    
}
/* module.exports.resetPassword = function (id, newPassword, callback) {
    User.findById(id, function (err, result) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newPassword, salt, function (err, hash) {
                result.password = hash;
                result.update(callback);
            });
        });
    });

} */
module.exports.getUserByUserName = function (username, callback) {
    var query = {
        username: username,
        isactive :true
    };
    User.findOne(query, callback);
}
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}
module.exports.pullNonAdmins = function (callback) {
    var query = {
        isadmin: false,
        isactive :true
    };
    User.find(query, callback).sort({ username : 1});
}
module.exports.pullNonAdminsAll = function (callback) {
    var query = {
        isadmin: false
    };
    User.find(query, callback).sort({ username : 1});
}