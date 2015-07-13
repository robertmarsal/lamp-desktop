'use strict';

var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('less', function () {
    return gulp.src('app/less/main.less')
               .pipe(less())
               .pipe(gulp.dest('app/css'));
});

gulp.task('watch', function() {
    gulp.run('less');
    gulp.watch('app/**/*.less', ['less']);
});
