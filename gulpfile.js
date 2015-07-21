var gulp = require('gulp');
var gutil = require('gulp-util');
var gConcat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");

// require sass
var sass = require('gulp-ruby-sass');

gulp.task('sass', function () {
  sass('src')
      .on('error', function (err) {
        console.error('Error!', err.message);
      })
      .pipe(gulp.dest('dist'));
});

gulp.task('html2js', function() {
  gulp.src("src/**/*.html")
      .pipe(ngHtml2Js({
        moduleName: "mcc.directives.templates",
        prefix: "templates/"
      }))
      .pipe(gulp.dest("temp/templates"));

  gulp.src('temp/**/*.js')
      .pipe(gConcat('templates.js'))
      .pipe(gulp.dest('./src/'));
});

gulp.task('dist', function() {
  return gulp
      .src([
        'dist-prefix.js',
        'src/modules.js',
        'src/templates.js',
        'src/mcc-grid/**/*.js',
        'src/mcc-modal/**/*.js',
        'dist-suffix.js'])
      .pipe(gConcat('mcc-components.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['sass', 'html2js', 'dist']);