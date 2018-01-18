var fse = require('fs-extra');
var csv = require('fast-csv');
var DOCUMENT = require('../../models/document.js');


const csvStream = csv({headers:true, objectMode:true, trim:true});

function findDocumentPath(dataSet, docnoArray, project, callback){
    const documents=[];
    const existingDocNo = docnoArray ? docnoArray : [];
    fse.createReadStream(path.join('../resources/DATASETS',dataSet,'documents.csv'),{autoClose:true})
    .pipe(csvStream)
    .on('data',function(row){
        if(existingDocNo.includes(row.DOCUMENT_NO)){
            documents.push(
                new DOCUMENT({
                    "document_no": row.DOCUMENT_NO,
                    "document_file": row.DOCUMENT_FILE,
                    "project": project
                })
            );
        }
    }).
    on('error', function(err){
        callback(err, null);
    }).
    on('end', function(){
        callback(null, documents);
    });
}
module.exports.findDocuments = findDocumentPath;
