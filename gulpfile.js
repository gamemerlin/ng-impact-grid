var gulp = require('gulp');
var gutil = require('gulp-util');
var gConcat = require('gulp-concat');

// require sass
var sass = require('gulp-ruby-sass');

gulp.task('sass', function () {
  sass('src')
      .on('error', function (err) {
        console.error('Error!', err.message);
      })
      .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  return gulp
      .src([
        'dist-prefix.js',
        'src/**/*.js',
        'dist-suffix.js'])
      .pipe(gConcat('mcc-grid.js'))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['sass', 'scripts']);