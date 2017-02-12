var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var fs    = require('fs');
var yaml   = require('js-yaml');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
const babel = require('gulp-babel');
// var cssnano = require('gulp-cssnano');

var sassPaths = [
  'bower_components/normalize.scss/sass',
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

// Load settings from settings.yml
var { COMPATIBILITY, PATHS } = loadConfig();

function loadConfig() {
  var ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: PATHS.sass,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // .pipe(cssnano())
    .pipe(gulp.dest(PATHS.dist + '/css'));
});
// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {
  return gulp.src(PATHS.javascript)
    // .pipe($.sourcemaps.init())
    // .pipe($.babel({ignore: ['what-input.js']}))
    // .pipe(minify())
    .pipe(babel({
            presets: ['es2015']
        }))
    .pipe(concat('app.js'))
    .pipe(uglify()
      .on('error', e => { console.log(e); })
    )

    // .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/js'));
});

gulp.task('default', ['sass', 'javascript'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
  gulp.watch(['js/**/*.js'], ['javascript']);
});
