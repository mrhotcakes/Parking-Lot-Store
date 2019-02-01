var projectName = 'app';

// Defining base pathes
var basePaths = {
    dev: './_dev/',
    node: './node_modules/'
};

// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ignore = require('gulp-ignore');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var gulpSequence = require('gulp-sequence')

// swallowError
function swallowError(self, error) {
    console.log(error.toString())
    self.emit('end')
}

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task('sass', function () {
    return gulp.src(basePaths.dev + 'sass/*.scss')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

// Run:
// gulp minify-css
// Minifies CSS files
gulp.task('minify-css', function() {
  return gulp.src('./css/'+projectName+'.css')
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css/'));
});

// Run:
// gulp styles
// Compiles SCSS files in CSS and minifies
gulp.task('styles', function(callback){ gulpSequence('sass', 'minify-css')(callback) });

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task('watch', function () {
    gulp.watch(basePaths.dev + 'sass/**/*.scss', gulp.series('styles'));
    gulp.watch(basePaths.dev + 'js/**/*.js', gulp.series('scripts'));
});

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task('scripts', function() {
    var scripts = [
        // Popper.js
        basePaths.node + 'popper.js/dist/umd/popper.min.js',
        // Bootstrap 4
        basePaths.node + 'bootstrap/dist/js/bootstrap.min.js',
        // Theme
        basePaths.dev + 'js/'+projectName+'.js'
    ];
  gulp.src(scripts)
    .pipe(concat(projectName+'.min.js'))
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest('./js/'));

  gulp.src(scripts)
    .pipe(concat(projectName+'.js'))
    .pipe(gulp.dest('./js/'));
});
