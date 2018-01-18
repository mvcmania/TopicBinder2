/* var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )

liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString()
     if (this._lastLineData) data = this._lastLineData + data

     var lines = data.split('\n')
     this._lastLineData = lines.splice(lines.length-1,1)[0]

     lines.forEach(this.push.bind(this))
     done()
}

liner._flush = function (done) {
     if (this._lastLineData) this.push(this._lastLineData)
     this._lastLineData = null
     done()
}

module.exports = liner */
var stream = require('stream');
var rooter = new stream.Transform( { objectMode: true } );
var isfirst = false;
rooter._transform = function (chunk, encoding, done) {
    var string = chunk.toString().replace(/[^\x00-\xFF]/g, '');
    //console.log(string);
        if(!isfirst){
            isfirst = true;
            var line = '<ROOT>'+string;
            this.push(line);
        }else{
            this.push(string);
        }
        done();
};

rooter._flush = function (done) {
        this.push('</ROOT>');
        done();
    
};
module.exports = rooter;