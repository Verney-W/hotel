
var gulp = require('gulp');
var less = require('gulp-less');
var browsersync= require('browser-sync').create();
var reload = browsersync.reload;


gulp.task('start',['less'],function() {
	browsersync.init({
		server:{baseDir:'./'},
		startPath:'src/html/index.html'
	});

	gulp.watch('src/less/*.less',['less']);
	gulp.watch('src/html/*.html').on('change',reload);
	gulp.watch('src/js/*.js').on('change',reload);
	gulp.watch('src/img/*.jpg').on('change',reload);
});

gulp.task('less',function(){
	gulp.src('src/less/main.less')
	.pipe(less())
	.on('error',function(err){
            console.log(err.message);
        })
	.pipe(gulp.dest('src/css'))
	.pipe(reload({stream:true}))
});