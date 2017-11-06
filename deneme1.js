var fs = require('fs'),
    xml2js = require('xml2js');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var Docs = require('./models/document');
var parser = new xml2js.Parser({
    trim: true
});
var async = require('async');
require('dotenv').config();

var root = '/resources/extract/FBIS';
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
var tempfiles = [];
var obj = [];
// Loop through all the files in the temp directory
fs.readdir( __dirname + root, function( err, files ) {
files.forEach(function(file, index){
    console.log('File =',file);
fs.readFile(__dirname + root +'/'+file, function (err, data) {
    parser.parseString(data, function (err, result) {
        //console.dir(result);
        //console.log('File =',file);
        if(result){
        if (result.hasOwnProperty('ROOT')) {
            for (var k in result.ROOT.DOC) {
                var tempDoc = new Docs({
                    document_id: result.ROOT.DOC[k].HEADER.AU,
                    document_no: result.ROOT.DOC[k].DOCNO,
                    document_file : file
                });
                obj.push(tempDoc);
            }
        }
        tempfiles.push(file);
        //console.log('Obj=',obj);
               

        if(tempfiles.length == files.length){
            Docs.collection.insertMany(obj, function (err2, doc2) {
                if (doc2) {
                    console.log('Mongo call back =',doc2);
                }
                if (err2) {
                    console.log('Mongo call back error=',err2);
                }
                
            });
        }
        /* for (var indx in result.ROOT.DOC[0][m]) {
            if (result.ROOT.DOC[0][m][indx].hasOwnProperty('P')) {
                console.log(m, '=', result.ROOT.DOC[0][m][indx]['P']);
            }else{
                console.log(m, '=', typeof(result.ROOT.DOC[0][m][indx]));
            }
        } */
    }else{
        console.log('Error parser =',err);
    }
    });
});
});
});