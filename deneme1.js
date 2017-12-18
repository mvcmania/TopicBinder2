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

var obj = [];
function buildRegex(prop){
    var tempRegex = '<'+prop+'>([\\s\\S]*?)<';
    return new RegExp(tempRegex,'g');
}
var bulk;
// Loop through all the files in the temp directory
fs.readdir( __dirname + root, function( err, files ) {
files.forEach(function(file, index){
    console.log('File =',file);
fs.readFile(__dirname + root +'/'+file, function (err, data) {
    //parser.parseString(data, function (err, result) {
            //console.dir(result);
            //console.log('File =',file);
            if(data){
                var tempfiles = [];
                var prop = ['DOCNO'];
                prop.forEach(pel =>{
                    
                    var reg = buildRegex(pel);
                    var count = -1;
                    while ((m = reg.exec(data)) !== null) {
                        // This is necessary to avoid infinite loops with zero-width matches
                        if (m.index === reg.lastIndex) {
                            reg.lastIndex++;
                        }
                        count++;
                        var docItem = tempfiles[count];
                        docItem = Docs.mapRegex(m, pel, docItem);
                        docItem.document_file = 'FBIS/'+file
                        //bulk.insert(docItem);
                        tempfiles[count]=docItem;
                    }
                });
                    /* if (result.hasOwnProperty('ROOT')) {
                        for (var k in result.ROOT.DOC) {
                            var tempDoc = new Docs({
                                document_id: result.ROOT.DOC[k].HEADER.AU,
                                document_no: result.ROOT.DOC[k].DOCNO,
                                document_file : file
                            });
                            obj.push(tempDoc);
                        }
                    } */
                    //tempfiles.push(file);
                    //console.log('Obj=',obj);
                        

                     if(tempfiles.length >0){
                        console.log('tempFiles = ',tempfiles);
                         Docs.collection.insertMany(tempfiles, function (err2, doc2) {
                            if (doc2) {
                                console.log('Mongo call back =',doc2);
                            }
                            if (err2) {
                                console.log('Mongo call back error=',err2);
                            }
                            
                        }); 
                    }
                }else{
                    console.log('Error parser =',err);
                }
    //});
});
});
});