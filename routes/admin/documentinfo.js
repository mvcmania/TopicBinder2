var fse = require('fs-extra');
//var csv = require('fast-csv');
var async = require('async');
var path =  require('path');
var es = require('event-stream');
var DOCUMENT = require('../../models/document.js');
var PROJECT = require('../../models/project.js');



function findDocumentPath(docnoArray, project, callback) {
    const documents = [];
    const existingDocNo = docnoArray ? docnoArray : [];
    var actualCount =0;
    //let csvStream = csv({ headers: true, objectMode: true, trim: true });
    async.waterfall([
        function(next){
            PROJECT.findOne({ name: project }, next);
        },
        function(record, next){
            C.logger.info('existingDocNo', existingDocNo.length);
            C.logger.info('existingDocNo length', existingDocNo);
            C.logger.info('recor', record);
            var onData = function(row){
                
                var spl = row.split(',');
                if (existingDocNo.includes(spl[0])) {
                    actualCount++;
                    documents.push(
                        new DOCUMENT({
                            "document_no": spl[0],
                            "document_file": spl[1],
                            "project": record.name,
                            "unique_id":spl[0]+'_'+record.name
                        })
                    );
                }
            }
             fse.createReadStream(path.join(__dirname,'../../resources/DATASETS', record.dataset, 'documents.csv'), { autoClose: true })
                .pipe(es.split())
                .pipe(es.mapSync(onData))
                .on('error', function(err) {
                    console.log('err doc info',err);
                    
                    next(err, null);
                })
                .on('end', function() {
                    C.logger.info('actualCount =', actualCount);
                    C.logger.info('Document', documents);
                    C.logger.info('Document Length', documents.length);
                    if (documents.length > 0) {
                        DOCUMENT.insertDocuments(documents, next);
                    }else{
                        next(null, null);
                    }
                });
            //next(null);
        }
    ], callback);

}
module.exports.findDocuments = findDocumentPath;