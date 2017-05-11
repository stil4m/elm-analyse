const gulp = require('gulp');
const gulpReplace = require('gulp-replace');
const elm = require('gulp-elm');
const devMode = true;
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');


gulp.task('elm-init', function() {
    return elm.init();
});


gulp.task('elm-client', ['elm-init'], function() {
    return gulp.src('src/Client.elm')
        .pipe(elm.bundle('client-elm.js'))
        .on('error', function(e) {
            //Elm compilation errors are already logged to the console
            if (!devMode) {
                throw e;
            } else {
                console.log(e);
            }
        })
        .pipe(gulp.dest('js/public'));
});

gulp.task('elm-backend', ['elm-init'], function() {
    return gulp.src('src/Analyser.elm')
        .pipe(elm.bundle('backend-elm.js'))
        .on('error', function(e) {
            //Elm compilation errors are already logged to the console
            if (!devMode) {
                throw e;
            } else {
                console.log(e);
            }
        })
        .pipe(gulp.dest('js'));
});

gulp.task('elm-all', function() {
    return runSequence('elm-client', 'elm-backend');
});

gulp.task('watch', ['html', 'elm-backend', 'elm-client'], function() {
    gulp.watch(['src/**'], function() {
        runSequence('elm-all');
    });
});

gulp.task('lint', () => {
    return gulp.src(['js/**/*.js',
        '!js/public/graph.js',
        '!js/backend-elm.js',
        '!js/public/client-elm.js',
        '!js/public/sigma/**/*.js'
    ])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('html', () => {
    const packageVersion = require('./package.json').version;
    gulp.src('html/index.html')
      .pipe(gulpReplace(/\{\{VERSION\}\}/g, 'v' + packageVersion))
      .pipe(gulp.dest('js/public/'));
});


gulp.task('default', ['elm-backend', 'elm-client', 'html']);
