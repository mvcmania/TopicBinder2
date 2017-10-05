/// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}
// Read the file and print its contents.
var fs = require('fs'),filename = process.argv[2];
fs.readFile(filename, 'utf8', function (err, data) {
  if (err) throw err;
  console.log('OK: ' + filename);

  var reg = new RegExp(/<top>\n\n<num>((?:[^\\<])+)<title>((?:[^\\<])+)<desc>((?:[^\\<])+)<narr>((?:[^\\<])+)/g);
  let m;
  while ((m = reg.exec(data)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === reg.lastIndex) {
      reg.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    //m.forEach((match, groupIndex) => {
    //    console.log('Found match, group %d : %s',groupIndex,match);
    //});
    console.log(m[4]);
  }
});