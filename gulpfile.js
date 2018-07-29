const gulp = require('gulp');
const gulpReplace = require('gulp-replace');

gulp.task('html', () => {
    const packageVersion = require('./package.json').version;
    gulp
        .src('html/index.html')
        .pipe(gulpReplace(/\{\{VERSION\}\}/g, 'v' + packageVersion))
        .pipe(gulp.dest('dist/public/'));
});
