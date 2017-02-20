var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema =  mongoose.Schema({
    name :{
      type: String
    },
    username : {
        type: String ,
        index : true
    },
    password : {
       type : String
    },
    email : {
      type :String
    },
    isadmin : {
      type: Boolean,
      default  : false
    }

});

var User = module.exports =  mongoose.model('User', userSchema);

module.exports.createUser = function (newUser , callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password =  hash;
        newUser.save(callback);
    });
  });
}

module.exports.getUserByUserName = function(username,callback){
   var query =  {username :  username};
   User.findOne(query,callback);
}
module.exports.getUserById = function(id,callback){
   User.findById(id,callback);
}
module.exports.comparePassword =  function(candidatePassword,hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null,isMatch);
  });
}
