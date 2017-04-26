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
var Busboy = require('busboy');
var Pool = require('./models/pool');


mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

var routes =  require('./routes/index');
var users =  require('./routes/users');

//Init app

var app = express();

//View Engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout : 'layout'}));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret: 'secret',
  saveUninitalized : true,
  resave:  true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express validator
app.use(expressValidator({
    errorFormatter :  function(param, msg, value){
       var namespace =  param.split('.')
       , root =  namespace.shift()
       , formParam = root;
       while(namespace.length){
         forParam += '[' + namespace.shift() + ']';
       }
       return {
         param :  formParam,
         msg : msg,
         value : value
       }
    }
}));

//connect flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user =  req.user || null;
  next();
});

app.post('/',function(req,res,next){
    var busboy = new Busboy({headers : req.headers});
    busboy.on('file',function(fieldname,file,filename,encoding,mimetype){
        var all_rows='';
        file.on('data',function(data){
          all_rows += data;       
        });
        file.on('end',function(data){
          console.log('Finished with read data : file name :'+filename);
          csv_parse(all_rows,res);
        });
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
    });

    req.pipe(busboy);

    //res.render('dashboard');
});

function csv_parse(records,res){
  //Split with new line
  var arr = records.split("\n");
  var pool_array=[];
  arr.map(function(val){
    var splitted = val.split(" ");
    var obj = { 
      "document_id" : splitted[2],
      "topic_id" : splitted[0],
      "score" : parseInt(splitted[3]),
      "isrelated" : false,
     };
     pool_array.push(obj);
  });
  if(pool_array.length > 0){
      Pool.collection.insertMany(pool_array,function(err,docs){
        if(err){
            console.log("Error occured..on bulk pool saving...",err);
            res.status(500).send('error occured..on bulk pool saving...'+ err); 
        }else{
            console.info('here is the saving result : %o ',docs);
            res.status(200).redirect('/');
        } 
        res.end();        
    });
  }
}

app.use('/', routes);
app.use('/users', users);



// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
