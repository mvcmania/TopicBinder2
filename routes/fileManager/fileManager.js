/* var fs = require('co-fs');
var co = require('co');
var fse = require('co-fs-extra');
var JSZip = require('jszip'); */
var path = require('path');
var async = require('async');

var fs = require('fs');

var fse = require('fs-extra');
var FileManager = {};

FileManager.getStats = function (p) {
    var stats =fs.statSync(p);
    
    C.logger.info('result',result);
    return result;
};

FileManager.list = function (dirPath, cb) {
    async.waterfall([
      function(next){
        fs.readdir(dirPath,next);
      },
      function(files, next){
        var paths =
       files.map(function (file) { return path.join(dirPath,file) })
        async.map(paths, fs.stat, function(err, stats){
          var statsArray = [];
          for(var i=0; i<files.length; i++){
            var result = {
              name: files[i],
              folder: stats[i].isDirectory(),
              size: stats[i].size,
              mtime: stats[i].mtime.getTime()
            }
            statsArray.push(result);
          }
          next(err, statsArray);
          
        });
      }
    ],cb);
  
};

FileManager.remove = function (p,cb) {
  fse.remove(p,cb);
};

FileManager.mkdirs = function (dirPath, cb) {
      fs.mkdir(dirPath, cb);
};

FileManager.move = function (srcs, dest, cb) {
  var srcMap ={};
  srcs.forEach(element => {
    srcMap[element]=dest
  });

  async.mapValues(srcMap, 
      function(value, key, cb){
        var basename = path.basename(key);
        fse.move(key, path.join(value, basename),{ overwrite: true }, cb);
      },cb
  );
 /*  for (var i=0; i<srcs.length; ++i) {
    var basename = path.basename(srcs[i]);
    yield fs.move(srcs[i], path.join(dest, basename));
  } */
};

FileManager.rename = function (src, dest,cb) {
   fse.move(src, dest,cb);
};

FileManager.archive = function *(src, archive, dirPath, embedDirs) {
  /* var zip = new JSZip();
  var baseName = path.basename(archive, '.zip');

  function* addFile(file) {
    var data = yield fs.readFile(file);
    var name;
    if (embedDirs) {
      name = file;
      if (name.indexOf(dirPath) === 0) {
        name = name.substring(dirPath.length);
      }
    } else {
      name = path.basename(file);
    }
    zip.file(name, data);
    C.logger.info('Added ' + name + ' ' + data.length + ' bytes to archive ' + archive);
  }

  function* addDir(dir) {
    var contents = yield fs.readdir(dir);
    for (var file of contents) {
      yield * process(path.join(dir, file));
    }
  }

  function* process(fp) {
    var stat = yield fs.stat(fp);
    if (stat.isDirectory()) {
      yield * addDir(fp);
    } else {
      yield addFile(fp);
    }
  }

  // Add each src.  For directories, do the entire recursive dir.
  for (var file of src) {
    yield * process(file);
  }

  // Generate the zip and store the final.
  var data = yield zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'});
  yield fs.writeFile(archive, data, 'binary'); */
};

module.exports = FileManager;
