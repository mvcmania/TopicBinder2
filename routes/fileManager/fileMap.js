var path = require('path');

var DATA_ROOT = path.join(__dirname,'../../projects');//C.data.root;
var DATA_SET_ROOT = path.join(__dirname,'../../projects');//C.data.root;
exports.filePath = function (relPath, projectid, decodeURI) {
  if (decodeURI) relPath = decodeURIComponent(relPath);
  if (relPath.indexOf('..') >= 0){
    var e = new Error('Do Not Contain .. in relPath!');
    e.status = 400;
    throw e;
  }
  else {
    var firstPath = path.join(DATA_ROOT, projectid) 
    return path.join(firstPath,relPath);
  }
};
