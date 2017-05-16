'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', () => {
  return gulp.src('./app/styles/scss/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./app/styles/css'));
});

gulp.task('default', () => {
  gulp.watch('./app/styles/scss/*.scss', ['sass']);
});
