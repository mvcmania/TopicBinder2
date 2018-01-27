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
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
router.get('/usermanagement', ensureAuthenticated, function(req, res,next){
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
router.post('/', ensureAuthenticated, function(req, res,next){
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
router.get(/^\/(admin|member)\/.+$/, ensureAuthenticated, function(req, res,next){
  C.logger.info('index get =', req.url);
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
// Get Homepage /^\/(users)\/.+$/
router.get(/^\/(users)\/.+$/, function(req, res,next){
  C.logger.info('users get',req.isAuthenticated());
  if(req.isAuthenticated()){
    res.redirect('/');
  }else{
    return next();
  }
});

router.post(/^\/(admin|member)\/.+$/, ensureAuthenticated, function(req, res,next){
  C.logger.info('Post index =',req.url);
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
router.put(/^\/(admin|member)\/.+$/, ensureAuthenticated, function(req, res,next){
  C.logger.info('Put index =',req.url);
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});
router.delete(/^\/(admin|member)\/.+$/, ensureAuthenticated, function(req, res,next){
  C.logger.info('Delete index =',req.url);
  req.routeStrategy = req.user.isadmin ? AdminRouteStrategy : UserRouteStrategy
  req.routeStrategy.home(req,res,next);
});


function ensureAuthenticated (req, res, next){
  C.logger.info('Ensure Authenticated'+req.url);
  if(req.isAuthenticated()){
    return next();
  }else if(req.method === 'GET'){

    req.flash('error_msg','You are not logged in!');
    res.redirect('/users/login');
    //res.status(400).send('Unauthorized request!');
  }else{
    res.status(400).send('Unauthorized request!');
  }
}
module.exports = router;
