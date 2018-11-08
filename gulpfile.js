const minify = require('gulp-minify');
const gulp = require('gulp');

 
gulp.task('minify', function() {
  gulp.src(['jquery.ui.touch-punch.js'])
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});