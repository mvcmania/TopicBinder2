var fs = require('fs');
var FilePath = require('./fileMap').filePath;
var path = require('path');

module.exports = {
  realIp: function * (next) {
      this.req.ip = this.headers['x-forwarded-for'] || this.ip;
      yield *next;
  },

  handelError: function * (next) {
    try {
      yield * next;
    } catch (err) {
      this.status = err.status || 500;
      this.body = err.message;
      //C.logger.error(err.stack);
      console.error(err.stack);
      this.app.emit('error', err, this);
    }
  },

  loadRealPath: function (req, res, next) {
      C.logger.info('Load Real Path', req.params);
      C.logger.info('Load Real Path Project', req.query.project);
      var projectid = req.query.project ? req.query.project : '';
    // router url format must be /api/(.*)
    req['fPath'] = FilePath(req.params[0], projectid);
    //C.logger.info(this.request.fPath);
    //console.info(this.request.fPath);
    next();
  },

  checkPathExists: function (req, res, next) {
    // Must after loadRealPath
    C.logger.info('checkPathExists', req.fPath);
    fs.exists(req.fPath,(exists) =>{
        if(!exists){
            res.status(404).send('Path Not Exists!'); 
            
        }else {
             next();
        }
    })
      
  },

  checkPathNotExists: function (req, res, next) {
    var type = req.query.type;
      fs.exists(req.fPath,(exists) =>{
        if(exists){
            res.status(404).send('Path Has Exists!'); 
            
        }else {
            next();
        }
    })
  },
  checkTrackIdExists: function(req, res, next){
    console.log('Tool project exist',req.body);
    if(req.body.project){
      res.locals.runRoot = path.join(__dirname, '../../','projects',req.body.project,'run');
      console.log(res.locals.runRoot);
      //res.status(400).send('Track id not exist!'); 
      fs.readdir(res.locals.runRoot ,(err, files)=>{
          if(err || files.length ==0){
            res.status(400).send('Make sure the project directory exists and has input on run path!'); 
          }else{
            if(!req.body.rowCount){
              res.locals.rowCount = 50;
            }else{
              res.locals.rowCount = req.body.rowCount;
            }
            next();
          }
      });
      
    }else{
      res.status(400).send('Track id not exist!'); 
    }
  },
  checkProjectId : function(req, res, next){
    if(req.params.projectid){
      next();
    }else{
      res.sendError("Project id is required!",{ data: null});
    }
  }

};
