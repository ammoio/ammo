// dependencies
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var templateCache = require('gulp-angular-templatecache');


//Paths
var paths = {
    scripts: ['public/**/*.js'],
    vendorScripts: ['bower_components/**/*.js'],
    styles: ['public/**/*.css'],
    html: ['public/**/*.html', '!public/index.html'],
    index: ['public/index.html']
}

/**
 * Compile templates for use in the templateCache.
 */
gulp.task('html', function () {
    gulp.src(paths.html)
        .pipe(templateCache('templates.js', {standalone: true}))
        .pipe(gulp.dest('build/js/'));
});

/**
 * Compile templates for use in the templateCache.
 */
gulp.task('index', function () {
    gulp.src(paths.index)
        .pipe(gulp.dest('build/'));
});

/**
 * Concat scripts and move to build dir.
 */
gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    //.pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js/'));
});

/**
 * Concat vendor scripts and move to build dir.
 */
// gulp.task('vendor-scripts', function() {
//   gulp.src(paths.vendorScripts)
//     //.pipe(sourcemaps.init())
//       .pipe(concat('vendor.js'))
//     //.pipe(sourcemaps.write())
//     .pipe(gulp.dest('build/js/'));
// });

/**
 * Concat css and move to build dir.
 */
gulp.task('styles', function () {
  gulp.src(paths.styles)
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('build/css/'));
});

/**
 * Bumping version number and tagging the repository with it.
 *
 * You can use the commands
 *
 *     gulp patch   # makes v0.1.0 → v0.1.1
 *     gulp minor   # makes v0.1.1 → v0.2.0
 *     gulp major   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('bumps package version'))
        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('minor', function() { return inc('minor'); });
gulp.task('major', function() { return inc('major'); });

/**
 * Build entire app.
 */
gulp.task('build', ['scripts', 'styles', 'html', 'index']);

// Watch scripts, styles, and templates
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.vendorScripts, ['vendor-scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.index, ['index']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'build']);
