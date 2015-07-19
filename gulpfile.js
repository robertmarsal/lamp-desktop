'use strict';

var gulp  = require('gulp');
var less  = require('gulp-less');
var react = require('gulp-react');

gulp.task('jsx', function () {
    return gulp.src('app/js/**/*.jsx')
               .pipe(react())
               .pipe(gulp.dest('app/js'))
});

gulp.task('less', function () {
    return gulp.src('app/less/main.less')
               .pipe(less())
               .pipe(gulp.dest('app/css'));
});

gulp.task('watch', ['less', 'jsx'], function() {
    gulp.watch('app/**/*.less', ['less']);
    gulp.watch('app/**/*.jsx', ['jsx']);
});
