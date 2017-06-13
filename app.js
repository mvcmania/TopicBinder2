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
var mongo = require('mongodb');
var mongoose = require('mongoose');
var helpers = require('./public/lib/helper');

//process.env.MONGODB_URI='mongodb://heroku_bwcmzm1p:dumch6k7cjom726boh401mm5m7@ds153719.mlab.com:53719/heroku_bwcmzm1p';
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var admins = require('./routes/admin/admin');
var members = require('./routes/user/user');

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
    secret: 'secret',
    saveUninitalized: true,
    resave: true
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
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/admin', admins);
app.use('/member', members);



// Set Port
app.set('port', (3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});