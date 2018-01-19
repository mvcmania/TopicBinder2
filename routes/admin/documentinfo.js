var fse = require('fs-extra');
var csv = require('fast-csv');
var DOCUMENT = require('../../models/document.js');
var PROJECT = require('../../models/project.js');

const csvStream = csv({ headers: true, objectMode: true, trim: true });

function findDocumentPath(dataSet, docnoArray, project, callback) {
    const documents = [];
    const existingDocNo = docnoArray ? docnoArray : [];
    PROJECT.findOne({ name: project }, function(err, record) {
        if (err) {
            callback(err, null);
        }

        fse.createReadStream(path.join('../resources/DATASETS', record.dataset, 'documents.csv'), { autoClose: true })
            .pipe(csvStream)
            .on('data', function(row) {
                if (existingDocNo.includes(row.DOCUMENT_NO)) {
                    documents.push(
                        new DOCUMENT({
                            "document_no": row.DOCUMENT_NO,
                            "document_file": row.DOCUMENT_FILE,
                            "project": record.name
                        })
                    );
                }
            }).
        on('error', function(err) {
            callback(err, null);
        }).
        on('end', function() {
            if (documents.length > 0) {
                DOCUMENT.insertDocuments(documents, callback);
            }
        });
    });

}
module.exports.findDocuments = findDocumentPath;