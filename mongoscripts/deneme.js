 var fse = require('fs-extra');
var path = require('path');
var encoder = require('turkish-char-encoding');
var str = encoder('iso-8859-9').toUTF8('ÖöÇçŞşİıĞğÜü');
console.log(str);
/*
var csv = require('fast-csv');
var ids =["FT944-32","FT944-26"];

var options = {
    columns:["DOCUMENTNO","PATH"]
};
const csvStream = csv({headers:true, objectMode:true, trim:true});
fse.createReadStream('../resources/DATASETS/TREC5/documents.csv',{autoClose:true})
.pipe(csvStream)
.on('data',function(row){
    if(ids.includes(row.DOCUMENTNO)){
        console.log(row);
    }
}); */

/* var DOCUMENT = require('../models/document.js');

var docs = [];
docs.push(new DOCUMENT({
    document_no: "ABC",
    document_file: "ABCfile",
    project: "project"
}));

docs.forEach(element => {
    console.log(element.unique_id);
}); */

console.log(path.join(__filename,'models','resources','DATASETS'));