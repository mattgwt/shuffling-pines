var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var Server = require('karma').Server;
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var htmlreplace = require('gulp-html-replace');

// buildApp task
// need to remember to EXCLUDE test directories
gulp.task('buildApp', function(){
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/**/*.min.js',
    'src/js/*.js',])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('bist/js'))
    .pipe(connect.reload());
});

//gulp.task('buildVendor', function(){
//  return gulp.src([
//    'bower_components/jquery/dist/jquery.min.js',
//    'bower_components/angular/angular.min.js',
//    'bower_components/**/*.min.js'])
//    .pipe(concat('vendors.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('bist/js'));
//});

gulp.task('buildCSS', function(){
  return gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'src/css/**/*.css'])
  .pipe(concat('styles.css'))
  .pipe(minifycss())
  .pipe(gulp.dest('bist'))
  .pipe(connect.reload());
});

// moveHTML uses gulp-html-replace to change script tags in index.html
gulp.task('moveHTML', function(){
  return gulp.src('src/**/*.html')
    .pipe(htmlreplace({
      'css': 'styles.css',
      'js': 'js/app.js'
    }))
    .pipe(gulp.dest('bist'))
    .pipe(connect.reload());
});

//gulp.task('build', ['buildApp', 'buildVendor', 'buildCSS', 'moveHTML']);
gulp.task('build', ['buildApp', 'buildCSS', 'moveHTML']);

// **********************************

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    //singleRun: true
  }, done).start();
});

gulp.task('jshint', function(){
  return gulp.src(['src/js/**/*.js', 'src/js/tests/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['karma', 'jshint']);
//gulp.task('test', ['jshint']);

// ***************************************

gulp.task('connect', function(){
  connect.server({
    root: 'bist',
    livereload: true
  });
});

gulp.task('watch', function(){
  gulp.watch('src/js/**/*.js', ['buildApp']);
  gulp.watch('src/css/**/*.css', ['buildCSS']);
  gulp.watch('src/**/*.html', ['moveHTML']);
});

gulp.task('default', ['build', 'test', 'watch', 'connect']);
