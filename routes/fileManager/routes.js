/* var fs = require('co-fs'); */
var express = require('express');

var path = require('path');
/* var views = require('co-views'); */
var fs = require('fs');
/* var koaRouter = require('koa-router');
var bodyParser = require('koa-bodyparser');
var formParser = require('co-busboy'); */
var bodyParser = require('body-parser');
var Busboy = require('busboy');


var Tools = require('./tools');
var FilePath = require('./fileMap').filePath;
var FileManager = require('./fileManager');

var router = express.Router();
/* var render = views(path.join(__dirname, './views'), {map: {html: 'ejs'}});

router.get('/', function *() {
  this.redirect('files');
});

router.get('/files', function *() {
  this.body = yield render('files');
}); */
/* router.get('/admin/api', function(req,res,next){
    C.logger.info('GET File', req.path);
}); */
 router.get('/admin/api(*)', Tools.loadRealPath, Tools.checkPathExists, function (req, res, next) {
    
    C.logger.info('GET File', req.fPath);
  var p = req.fPath;
  fs.stat(p,function(err,stats){
    if (stats.isDirectory()) {
        FileManager.list(p, function(err, statsArray){
          //C.logger.info('Lists=', statsArray);
          res.status(200).send(statsArray);
        });
      }
      else {
        //this.body = yield fs.createReadStream(p);
        res.status(200).send(fs.createReadStream(p));
      }
  });
  
});

router.delete('/admin/api(*)', Tools.loadRealPath, Tools.checkPathExists, function (req, res, next) {
  var p = req.fPath;
  FileManager.remove(p, function(err){
     if(err) res.status(400).send('Error', err);
      res.status(200).send('Delete Succeed!'); 
  });
});

router.put('/admin/api(*)', Tools.loadRealPath, Tools.checkPathExists, function(req, res, next) {
  var type = req.query.type;
  var p = req.fPath;
  if (!type) {
    /* this.status = 400;
    this.body = 'Lack Arg Type' */
    res.status(400).send( 'Lack Arg Type');
  }
  else if (type === 'MOVE') {
    var src = req.body.src;
    if (!src || ! (src instanceof Array)) return res.send(400);
    var src = src.map(function (relPath) {
      return FilePath(relPath, true);
    });
    FileManager.move(src, p, function(err, result){
        if(err) res.status(400).send('Error', err);
        res.status(200).send('Move Succeed!');
    });
  }
  else if (type === 'RENAME') {
    var target = req.body.target;
    if (!target) return res.status(400);
    FileManager.rename(p, FilePath(target, true), function(err){
      if(err) res.status(400).send('Error on rename =',err);
      res.status(200).send('Rename succeed!');
    });
    
  }
  else {
    res.status(400).send('Arg Type Error!');
  }
});

router.post('/admin/api(*)', Tools.loadRealPath, function (req,res, next) {
  var type = req.query.type;
  var p = req.fPath;
  if (!type) {
    res.status(400).send( 'Lack Arg Type');
  }
  else if (type === 'CREATE_FOLDER') {
    
    FileManager.mkdirs(p,function(err){
      C.logger.info('mkdir',err);
      if(err) res.status(400).send( 'Error creating dir!');
      res.status(200).send('Folder created succeesfully!');
    });
  }
  else if (type === 'UPLOAD_FILE') {
    C.logger.info('Upload ', p);
    var context = req || this,
    busboy = new Busboy({ headers: context.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join(p,filename);
      file.pipe(fs.createWriteStream(saveTo));
      busboy.on('end', function() {
        C.logger.info('File end');
      });
    });
    busboy.on('finish', function() {
      res.status(200).send("Upload Succeed!");
    });
    
    req.pipe(busboy);
    //var formData = yield busboy(this.req);
    
  }
  /* else if (type === 'CREATE_ARCHIVE') {
    var src = this.request.body.src;
    if (!src) return this.status = 400;
    src = src.map(function(file) {
      return FilePath(file, true);
    })
    var archive = p;
    yield * FileManager.archive(src, archive, C.data.root, !!this.request.body.embedDirs);
    this.body = 'Create Archive Succeed!';
  } */
  else {
    this.status = 400;
    this.body = 'Arg Type Error!';
  }
});

module.exports = router;
