
if(!process.argv[2]){
  console.log('Please speficy the folder name in dataset!');
  return false;
}
console.log(process.argv[2],' started to be parsed!');
var path = require('path');
var fse= require('fs-extra');
var async  = require('async');
var transformer = require('./transform.js');
var fswalk = require('./filewalk.js');
var dataSetPath =path.join('../resources/DATASETS',process.argv[2],'DATA');
var documentInfoCsv =path.join('../resources/DATASETS',process.argv[2],'documents.csv');
var reg = new RegExp('<DOCNO>(.*)<\\/DOCNO>', 'g');

const writeStream = fse.createWriteStream(documentInfoCsv, {encoding:'UTF-8', autoClose: true});
writeStream.write("DOCUMENTNO,PATH"+"\n");

var readDocumentInfo = function(fPath, cb){
  fse.readFile(fPath, function(err, data) {
      if(!err){
        const ff = path.basename(fPath);
        while ((m = reg.exec(data)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === reg.lastIndex) {
                reg.lastIndex++;
            }
            if(m[1])writeStream.write(m[1].trim() + ',' +fPath + '\n');
            //tempDoc['DOCNO'] = m[1];
        }
        cb(null);
      }else{
        cb(err);
      }
  });
};

  fse.ensureFile(documentInfoCsv, function(err){
    fswalk.walk(dataSetPath, function(filePath, stats, isLast){
        const fparam = filePath;
        readDocumentInfo(fparam, function(err){
            if(err) console.log('Error while reading file!');
            else console.log('File processed =', fparam);
        });
    });
  });
  
