const gulp       = require('gulp');
const { series, parallel } = gulp;
const	sass       = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCSS     = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		uglify       = require('gulp-uglify'),
		babel 			 = require('gulp-babel'),
		plumber 		 = require('gulp-plumber');

const styles = () => {
	return gulp.src('src/assets/styles/*.sass')
	.pipe(sass({}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(cleanCSS())
	.pipe(gulp.dest('built/css'))
	.pipe(browserSync.stream());
}

const scripts = () => {
	return gulp.src('src/assets/scripts/*.js')
	.pipe(plumber())
	.pipe(babel({
            presets: ['@babel/env']
        })).on('error', console.error.bind(console))
	.pipe(uglify().on('error', console.error))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(gulp.dest('built/js'));
}

const server = () => {
	browserSync.init({
			proxy: "ibrahim-erkenov",
			browser: 'chrome',
			notify: false
	});
}

const watch = () => {
	gulp.watch('src/assets/styles/*.sass', styles);
	gulp.watch('src/assets/scripts/*.js', scripts);
	gulp.watch('src/assets/scripts/*.js').on("change", browserSync.reload);
	gulp.watch('built/*.html').on('change', browserSync.reload);
	gulp.watch('built/**/*.php').on('change', browserSync.reload);
}

exports.default = series(
	parallel(styles, scripts),
	parallel(watch, server)
)