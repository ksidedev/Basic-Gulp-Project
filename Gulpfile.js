var gulp 		= require('gulp');
var uglify 		= require('gulp-uglify');
var rename 		= require('gulp-rename');
var replace     = require('gulp-replace');
var insert      = require('gulp-insert');
var watch 		= require('gulp-watch');
var sass        = require('gulp-sass');
var fs          = require('fs');
var pkg         = require('./package');
var browserSync = require('browser-sync').create();
var reload		= browserSync.reload;

//
// Util: returns today's date
//
var getDate = function() {

    var date = new Date();
    var today = date.getUTCFullYear()
            + '-'
            + (date.getUTCMonth() + 1)
            + '-'
            + date.getUTCDate() ;
    return today;
};

//
// Prepare versioning info
//
var docs = fs.readFileSync('./docs/version.txt', 'utf8');
var doc = docs.replace('{{version}}', pkg.version);
doc = doc.replace('{{date}}', getDate());

//
// Compile SCSS files
//
gulp.task('sass', function() {
    doc = doc.replace('{{type}}', 'UI');
    return gulp.src('scss/*.scss')
        .pipe(sass({
        	outputStyle: 'compressed'
        }))
        .pipe(insert.prepend(doc))
        .pipe(gulp.dest('dist'));
});

//
// Compress JS files
//
gulp.task('compress', function () {
    doc = doc.replace('{{type}}', 'UI');
	return gulp.src('js/*.js')
		.pipe(uglify())
        .pipe(insert.prepend(doc))
		.pipe(gulp.dest('dist'))
});

//
// Watch JS files
//
gulp.task('js-watch', ['compress']);

//
// Watch SCSS files
//
gulp.task('css-watch', ['sass']);

//
// Default
//
gulp.task('default', ['sass', 'compress'], function () {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('js/*.js', ['js-watch']).on('change', reload);
    gulp.watch('scss/*.scss', ['css-watch']).on('change', reload);
    gulp.watch('./index.html').on('change', reload);
});