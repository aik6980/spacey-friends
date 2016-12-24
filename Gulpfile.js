var gulp = require("gulp");
var ts = require("gulp-typescript");
var concat = require('gulp-concat');

// typescript project for game
var ts_project_game 		= ts.createProject("tsconfig.game.json");
var ts_project_game_output 	= 'game.js';
var ts_project_controller 	= ts.createProject("tsconfig.controller.json");
var ts_project_controller_output = 'controller.js';

gulp.task("default", ['typescript', 'js_move']);

gulp.task("dev", function () {
    gulp.watch('assets/js/**/*.*', ['default']);
});

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
	var output_folder = "public/js";
	var ts_result_game 		= ts_project_game.src()
							.pipe(ts_project_game())
							.pipe(concat(ts_project_game_output))
							.pipe(gulp.dest(output_folder));
							
	var ts_result_controller = ts_project_controller.src()
							.pipe(ts_project_controller())
							.pipe(concat(ts_project_controller_output))
							.pipe(gulp.dest(output_folder));
    return ts_result_game && ts_result_controller;
});
