var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", ['babel', 'js_move']);

gulp.task("babel", function () {
    return gulp.src("assets/js/*.js")
        .pipe(babel())
        .pipe(gulp.dest("public/js"));
});

gulp.task("js_move", function () {
    return gulp.src("assets/js/vendor/**/*.js")
        .pipe(gulp.dest("public/js/vendor"));
});
