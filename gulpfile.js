var gulp = require('gulp');
var elm = require('gulp-elm');
var devMode = true;
var runSequence = require('run-sequence');

gulp.task('elm-init', function() {
  return elm.init();
});


gulp.task('elm-client', ['elm-init'], function() {
  return gulp.src('src/Client/Main.elm')
    .pipe(elm.bundle('client-elm.js'))
    .on('error', function(e) {
      //Elm compilation errors are already logged to the console
      if (!devMode) {
        throw e;
      } else {
        console.log(e)
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
        console.log(e)
      }
    })
   .pipe(gulp.dest('js'));
});

gulp.task('elm-all', function() {
  return runSequence('elm-client', 'elm-backend');
})

gulp.task('watch', ['elm-backend', 'elm-client'], function() {
  gulp.watch('src/**', function () {
    runSequence('elm-all');
  });
});

gulp.task('build', ['elm-backend', 'elm-client']);
