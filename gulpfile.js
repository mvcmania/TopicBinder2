// NOTE: I previously suggested doing this through Grunt, but had plenty of problems with
// my set up. Grunt did some weird things with scope, and I ended up using nodemon. This
// setup is now using Gulp. It works exactly how I expect it to and is WAY more concise.
var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    exec =  require('child_process').exec,
    node;
var rename = require('gulp-rename');
var defineModule = require('gulp-define-module');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['app.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
  /* gulp.run('templates');*/
  gulp.start('server');
  gulp.watch(['./app.js', './models/*.js','./routes/**/*.js','./routes/*.js'],['templates','server']);
  gulp.watch(['public/build/hb/templates/*.handlebars','views/partials/alert.handlebars'], ['copy','templates']);
  // Need to watch for sass changes too? Just add another watch call!
  // no more messing around with grunt-concurrent or the like. Gulp is
  // async by default.
})
/*** PRECOMPILE TEMPLATE */
gulp.task('templates', function(){
  exec('handlebars -m public/build/hb/templates/ -f public/build/hb/templates/templates.js',function(err, stdout, stderr){
    if(err){
      console.info('error',err);
    }
  });
  /*gulp.src('public/vendor/hb/templates/*.handlebars')
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('public/vendor/hb/templates/'));*/
});
gulp.task('copy', function(){
  gulp.src('views/partials/alert.handlebars').pipe(gulp.dest('public/build/hb/templates/'));
})



// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})