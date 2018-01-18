var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var mongo = require('mongodb');
var mongoose = require('mongoose');
var helpers = require('./public/lib/helper');
require('dotenv').config();

var db = mongoose.connect(process.env.MONGODB_URI,{
    useMongoClient : true,
    promiseLibrary: require('bluebird')
});
global.C = {
    logger: require('tracer').console({level: 'info'}),
    datasetPath:'resources/DATASETS'
};

var routes = require('./routes/index');
var users = require('./routes/users');
var admins = require('./routes/admin/admin');
var members = require('./routes/user/user');
var files = require('./routes/fileManager/routes');

//Init app js

var app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: helpers
}));
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie :{maxAge:1800000},
    resave: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            forParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

//connect flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.locals.success = req.flash('success');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/users', users);
app.use('/', routes);
/* app.use('/admin', admins);
app.use('/member', members);*/

app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  res.render('404', { status: 404, url: req.url });
});


// Set Port
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    C.logger.info('Server started on port ' + app.get('port'));
});