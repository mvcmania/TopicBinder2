var fse = require('fs-extra');
var csv = require('fast-csv');
var path =  require('path');
var DOCUMENT = require('../../models/document.js');
var PROJECT = require('../../models/project.js');

const csvStream = csv({ headers: true, objectMode: true, trim: true });

function findDocumentPath(docnoArray, project, callback) {
    const documents = [];
    const existingDocNo = docnoArray ? docnoArray : [];
    PROJECT.findOne({ name: project }, function(err, record) {
        if (err) {
            callback(err, null);
        }
        C.logger.info('existingDocNo', existingDocNo);
        C.logger.info('recor', record);
        fse.createReadStream(path.join(__dirname,'../../resources/DATASETS', record.dataset, 'documents.csv'), { autoClose: true })
            .pipe(csvStream)
            .on('data', function(row) {
                if (existingDocNo.includes(row.DOCUMENTNO)) {
                    documents.push(
                        new DOCUMENT({
                            "document_no": row.DOCUMENTNO,
                            "document_file": row.PATH,
                            "project": record.name,
                            "unique_id":row.DOCUMENTNO+'_'+record.name
                        })
                    );
                }
            }).
        on('error', function(err) {
            console.log('err doc info',err);
            callback(err, null);
        }).
        on('end', function() {
            C.logger.info('Document', documents);
            if (documents.length > 0) {
                DOCUMENT.insertDocuments(documents, callback);
            }else{
                callback(null, null);
            }
        });
    });

}
module.exports.findDocuments = findDocumentPath;