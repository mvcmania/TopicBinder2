var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var async = require('async');
/* var bcrypt = require('bcryptjs'); */
var crypto = require("crypto");
var mail = require('../models/mail');

router.get('/', function(req, res,next){

    res.redirect('/users/login');

});
// Get register
router.get('/register', function(req, res) {
    res.render('register', { islogin: true , layout: "loginlayout"});
});

// Get login
router.get('/login', function(req, res) {
    C.logger.info('users get',req.isAuthenticated());
    if(req.isAuthenticated()){
        res.redirect('/');
    }else{
        res.render('login', { islogin: true, layout: "loginlayout" });
    }
});
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
});
// Get forgot
router.get('/forgot', function(req, res,next){
    res.render('forgot', { islogin: true, layout: "loginlayout" })
});
//Password reset
router.get('/reset/:token', function(req, res) {
    User.findOne({ reset_password_token: req.params.token, reset_password_expires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/users/forgot');
      }
      res.render('resetpassword', {islogin: true, layout: "loginlayout", token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    C.logger.info('Password', req.body.password);
    async.waterfall([
      function(done) {
        User.findOne({ reset_password_token: req.params.token, reset_password_expires: { $gt: Date.now() } }, function(err, userReturn) {
          if (!userReturn) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
              C.logger.info('User', userReturn);
              userReturn.password = req.body.password;
              userReturn.reset_password_token = undefined;
              userReturn.reset_password_expires = undefined;
              User.createUser( userReturn, function(err, usr){
                  req.logIn(usr, function(err) {
                    done(err, usr);
                  });
              });

          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
         mail.sendEmail(user.email, user, 'Your password has been changed', 'passwordchange', function(err){
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
         });
      }
    ], function(err) {
        C.logger.info('err',err);
     if(err){
         req.flash('error',err);
         res.redirect('/users/forgot');
     }
     res.redirect('/users/login');
    });
  });
// Get Homepage
router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors,
            layout: "loginlayout"
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function(err, msg) {
            if (err) throw err;
            //C.logger.info(User);
            req.flash('success_msg', 'You are registered and can now login.');
            res.redirect('/users/login');
        });

    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUserName(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'invalid password!' });
                }
            })
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});
router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });
router.post('/forgot', function(req, res, next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            })
        },
        function(token, done){
            User.findOne({ email: req.body.email }, function(err, user) {
                if(!user){
                    req.flash('error','No user with that email address exists!');
                    return res.redirect('/users/forgot');
                }
                user.reset_password_token = token;
                user.reset_password_expires = Date.now() + 3600000; // 1 hour
                user.save(function(err) {
                    done(err, token, user);
                });


            });
        },
        function(token, user, done){
            var data = {link:'http://' + req.headers.host + '/users/reset/' + token};
            mail.sendEmail(user.email, data, 'TopicBinder Password Reset', 'passwordreset', function(err){
                C.logger.info('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                //return res.redirect('/users/forgot');
                done(err, 'done');
            })
        }
    ],
    function(err){
        if (err) return next(err);
        return res.redirect('/users/login');
    });
});
module.exports = router;
