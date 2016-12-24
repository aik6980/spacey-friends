var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ['typescript', 'js_move']);

gulp.task("babel", function () {
    return gulp.src("assets/js/*.js")
        .pipe(babel())
        .pipe(gulp.dest("public/js"));
});

gulp.task("js_move", function () {
    return gulp.src("assets/js/vendor/**/*.js")
        .pipe(gulp.dest("public/js/vendor"));
});

gulp.task("typescript", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("public/js"));
});
