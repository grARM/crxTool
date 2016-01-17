var gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify');

//语法检查
gulp.task('jshint', function(){
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//压缩，合并 js
gulp.task('minifyjs', function() {
    return gulp.src('src/*.js')      //需要操作的文件
        .pipe(concat('crxTools.js'))    //合并所有js到main.js
        //.pipe(gulp.dest('dist'))       //输出到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist'));  //输出
});

//默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
gulp.task('default', ['jshint'], function() {
    gulp.start('minifyjs'); 
});