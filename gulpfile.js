// dependencies
var gulp = require('gulp'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    filter = require('gulp-filter'),
    tag_version = require('gulp-tag-version'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    templateCache = require('gulp-angular-templatecache'),
    mainBowerFiles = require('main-bower-files'),
    karma = require('gulp-karma');


//Paths
var paths = {
  allScripts: ['public/**/*.js'],
  scripts: ['public/**/*.js', '!public/**/*.spec.js'],
  unitTests: ['public/**/*.spec.js'], // need to keep in sync with karma.conf.js
  styles: ['public/**/*.css'],
  html: ['public/**/*.html', '!public/index.html'],
  index: ['public/index.html']
};

/**
 * Compile templates for use in the templateCache.
 */
gulp.task('html', function () {
  gulp.src(paths.html)
    .pipe(templateCache('templates.js', {
      standalone: true,
      module: 'ammo.templates'
    }))
    .pipe(gulp.dest('build/js/'));
});

/**
 * Move index file to the build dir.
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
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('build/js/'));
});

/**
 * Concat vendor scripts and move to build dir.
 */
gulp.task('vendor-scripts', function() {
gulp.src(mainBowerFiles(), { base: 'bower_components' })
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('build/js/'));
});

/**
 * Concat css and move to build dir.
 */
gulp.task('styles', function () {
  gulp.src(paths.styles)
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('build/css/'));
});

/**
 * run karma tests
 */
gulp.task('test', function() {
  return gulp.src('unitTests')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      console.log(err);
      this.emit('end'); //instead of erroring the stream, end it
    });
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
gulp.task('build', ['vendor-scripts', 'scripts', 'styles', 'html', 'index']);

// Watch scripts, styles, and templates
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.vendorScripts, ['vendor-scripts']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.index, ['index']);
  gulp.watch(paths.allScripts, ['test']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'build', 'test']);
