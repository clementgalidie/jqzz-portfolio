// Include Gulp.
var gulp = require('gulp');

// Include our plugins.
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var minify = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

// Handle CLI errors

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// Gulp task to set up a server with livereload.
gulp.task('connect', function () {
	connect.server({
		root: './dev/',
		port: 1337,
		livereload: true
	});
});

// Gulp task to compile jade into plain html.
gulp.task('jade', function () {
	return gulp.src('./dev/*.jade')
		.pipe(jade())
		.on('error', handleError)
		.pipe(gulp.dest('./dev/'))
		.pipe(connect.reload());
});

// Gulp task to compile scss into plain css + autoprefix + minify +rename.
gulp.task('sass', function () {
	return gulp.src('./dev/assets/css/**/*.scss')
		.pipe(sass())
		.on('error', handleError)
		.pipe(autoprefixer())
		.pipe(gulp.dest('./dev/assets/css/'))
		.pipe(minify())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('./dist/assets/css/'))
		.pipe(connect.reload());
});

// Gulp task to concat + uglify + rename all js files.
gulp.task('js', function () {
	return gulp.src('./dev/assets/js/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dev/assets/js/'))
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest('./dist/assets/js/'))
		.pipe(connect.reload());
});

// Gulp task to watch each of the previous task for changes.
gulp.task('watch', function () {
	gulp.watch('./dev/*.jade', ['jade']);
	gulp.watch('./dev/assets/css/**/*.scss', ['sass']);
	gulp.watch('./dev/assets/js/*.js', ['js']);
});

// Gulp default task which'll be run via 'gulp' in CLI.
gulp.task('default', ['connect', 'watch']);