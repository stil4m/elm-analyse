var gulp = require('gulp');
var elm = require('gulp-elm');
var devMode = true;
var runSequence = require('run-sequence');

gulp.task('elm-init', function() {
  return elm.init();
});


gulp.task('elm', ['elm-init'], function() {
  return gulp.src('src/Client/Main.elm')
    .pipe(elm.bundle('elm.js'))
    .on('error', function(e) {
      //Elm compilation errors are already logged to the console
      if (!devMode) {
        throw e;
      } else {
        console.log(e)
      }
    })
   .pipe(gulp.dest('server/public'));
});

gulp.task('watch', ['elm'], function() {
  gulp.watch('src/**', function () {
    runSequence('elm');
  });
});
