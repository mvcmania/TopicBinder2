var express = require('express');
var router = express.Router();
var Busboy = require('busboy');
var Pool = require('../../models/pool');

router.get('/', function(req, res) {
    /*Pool.getTopics(function(err, pools) {
        res.render('dashboard', { pools: pools });
    });
*/
    res.render('dashboard', { pools: {} });
});
router.get('/topicsummary', function(req, res, next) {
    Pool.getTopicsSummary(function(err, result) {
        res.send(result, {
            'Content-Type': 'application/json'
        }, 200);
    });
});
router.post('/', function(req, res, next) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var all_rows = '';
        file.on('data', function(data) {
            all_rows += data;
        });
        file.on('end',function(data){
          console.log('Finished with read data : file name :'+filename);
          csv_parse(all_rows,res);
        });
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
    });

    req.pipe(busboy);
    res.end();
    //res.render('dashboard');
});

function csv_parse(records,res){
  //Split with new line
  var arr = records.split("\n");
  var pool_array=[];
  arr.map(function(val){
    var splitted = val.split(" ");
    var obj = {
      "document_id" : splitted[2],
      "topic_id" : splitted[0],
      "score" : parseInt(splitted[3]),
      "isrelated" : false,
     };
     pool_array.push(obj);
  });
  if(pool_array.length > 0){
      Pool.collection.insertMany(pool_array,function(err,docs){
        if(err){
            console.log("Error occured..on bulk pool saving...",err);
            res.status(500).send('error occured..on bulk pool saving...'+ err);
        }else{
            console.info('here is the saving result : %o ',docs);
            res.status(200).redirect('/');
        }
      //  res.end();
    });
  }
}

module.exports = router;
