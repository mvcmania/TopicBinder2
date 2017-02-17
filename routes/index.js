var express = require('express');
var router = express.Router();

//Admin Strategy 
var AdminRouteStrategy = {
  home : require('./admin/admin')
}
//USer Strategy 
var UserRouteStrategy = {
  home : require('./user/user')
}

// Early as possible assign current strategy based on user type
/*function (req, res, next) {
   req.routeStrategy = req.user.admin ? AdminRouteStrategy : UserRouteStrategy
    req.routeStrategy = req.user.admin ? AdminRouteStrategy : UserRouteStrategy
   next(); // don't forget this
}*/
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res,next){
  console.log(req.user.isadmin);
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
// Get Homepage
router.get('/users/login', function(req, res,next){
	if(req.isAuthenticated()){
    res.redirect('/');
  }else{
    return next();
  }
});
function ensureAuthenticated (req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
  //  req.flash('error_msg','You are not logged in!');
    res.redirect('/users/login');
  }
}
module.exports = router;
