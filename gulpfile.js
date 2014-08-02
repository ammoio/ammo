// dependencies
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');


//Paths
var paths = {
    scripts: ['public/**/*.js', '!public/bower_components/**'],
    styles: ['public/**/*.css', '!public/bower_components/**']
}

/**
 * Concat scripts and move to build dir.
 */
gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js/'));
});

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
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe(git.commit('bumps package version'))

        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('minor', function() { return inc('minor'); });
gulp.task('major', function() { return inc('major'); });


// Watch scripts, styles, and templates
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'styles']);
