
if(!process.argv[2]){
  console.log('Please speficy the folder name in dataset!');
  return false;
}
console.log(process.argv[2],' started to be parsed!');
var docno_tag = process.argv[3] ? process.argv[3] : 'DOCNO'; 
var es = require('event-stream');
var path = require('path');
var fse= require('fs-extra');
var async  = require('async');
var transformer = require('./transform.js');
var fswalk = require('./filewalk.js');
var dataSetPath =path.join('../resources/DATASETS',process.argv[2],'DATA');
var documentInfoCsv =path.join('../resources/DATASETS',process.argv[2],'documents.csv');
var reg = new RegExp('<'+docno_tag+'>(.*)<\\/'+docno_tag+'>', 'g');
const writeStream = fse.createWriteStream(documentInfoCsv, {encoding:'UTF-8', autoClose: true});
writeStream.write("DOCUMENTNO,PATH"+"\n");

var textContent ='';
var startContent = false;
var readDocumentInfo = function(fPath, cb){
  var stream = fse.createReadStream(fPath)
  .pipe(es.split('</DOC>'))
  .pipe(es.mapSync(function(line){
    stream.pause();
    
    while ((m = reg.exec(line)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === reg.lastIndex) {
            reg.lastIndex++;
        }
        if(m[1])writeStream.write(m[1].trim() + ',' +fPath + '\n');
        //console.log('line=',m[1]);
     }
     stream.resume();
  }))
  .on('error', function(err){
    cb(err);
  })
  .on('end', function(){
    cb(null);
  });
  /* fse.readFile(fPath, function(err, data) {
      if(!err){
         
        console.log(data.toString());
        cb(null);
      }else{
        cb(err);
      }
  }); */
};

  fse.ensureFile(documentInfoCsv, function(err){
    fswalk.walk(dataSetPath, function(filePath, stats, isLast){
        const fparam = filePath;
        readDocumentInfo(fparam, function(err){
           //console.log('Content==', textContent);
            if(err) console.log('Error while reading file!');
            else console.log('File processed =', fparam);
        });
    });
  });
  
