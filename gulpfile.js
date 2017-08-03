const gulp = require("gulp");
const gulpReplace = require("gulp-replace");
const elm = require("gulp-elm");
const devMode = true;
const runSequence = require("run-sequence");

gulp.task("elm-init", function() {
    return elm.init();
});

gulp.task("elm-docs", ["elm-init"], function() {
    return gulp
        .src("docs/Docs/Main.elm")
        .pipe(elm.bundle("docs.js"))
        .on("error", function(e) {
            //Elm compilation errors are already logged to the console
            if (!devMode) {
                throw e;
            } else {
                console.log(e);
            }
        })
        .pipe(gulp.dest("docs"));
});
gulp.task("elm-client", ["elm-init"], function() {
    return gulp
        .src("src/Client.elm")
        .pipe(elm.bundle("client-elm.js"))
        .on("error", function(e) {
            //Elm compilation errors are already logged to the console
            if (!devMode) {
                throw e;
            } else {
                console.log(e);
            }
        })
        .pipe(gulp.dest("js/public"));
});

gulp.task("elm-backend", ["elm-init"], function() {
    return gulp
        .src("src/Analyser.elm")
        .pipe(elm.bundle("backend-elm.js"))
        .on("error", function(e) {
            //Elm compilation errors are already logged to the console
            if (!devMode) {
                throw e;
            } else {
                console.log(e);
            }
        })
        .pipe(gulp.dest("js"));
});

gulp.task("elm-all", function() {
    return runSequence("elm-client", "elm-backend", "elm-docs");
});

gulp.task(
    "watch",
    ["html", "elm-backend", "elm-client", "elm-docs"],
    function() {
        gulp.watch(["src/**"], function() {
            runSequence("elm-all");
        });
    }
);

gulp.task("html", () => {
    const packageVersion = require("./package.json").version;
    gulp
        .src("html/index.html")
        .pipe(gulpReplace(/\{\{VERSION\}\}/g, "v" + packageVersion))
        .pipe(gulp.dest("js/public/"));
});

gulp.task("default", ["elm-backend", "elm-client", "html", "elm-docs"]);
