(function () {
	"use strict";

	//******************************************************************************
	//* DEPENDENCIES
	//******************************************************************************
	var
		gulp = require("gulp"),
		browserify = require("browserify"),
		source = require("vinyl-source-stream"),
		buffer = require("vinyl-buffer"),
		tslint = require("gulp-tslint"),
		tsc = require("gulp-typescript"),
		sourcemaps = require("gulp-sourcemaps"),
		uglify = require("gulp-uglify"),
		runSequence = require("run-sequence"),
		mocha = require("gulp-mocha"),
		istanbul = require("gulp-istanbul"),
		browserSync = require('browser-sync').create(),
		cssnano = require('gulp-cssnano'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename');

	//******************************************************************************
	//* LINT
	//******************************************************************************
	gulp.task("lint", function () {
		return gulp.src([
			"source/**/**.ts",
			"tests/**/**.spec.ts"
		])
			.pipe(tslint({}))
			.pipe(tslint.report("verbose"));
	});

	//******************************************************************************
	//* BUILD
	//******************************************************************************
	var tsProject = tsc.createProject("tsconfig.json");
	gulp.task("build-app", function () {
		return gulp.src([
			"source/**/**.ts",
			"source/interfaces/interfaces.d.ts",
			"typings/main.d.ts/",
			"typings/adal.d.ts/"
		])
			.pipe(tsc(tsProject))
			.js.pipe(gulp.dest("source/"));
	});

	var tsTestProject = tsc.createProject("tsconfig.json");
	gulp.task("build-tests", function () {
		return gulp.src([
			"tests/**/**.spec.ts",
			"source/interfaces/interfaces.d.ts",
			"typings/main.d.ts/",
			"typings/adal.d.ts/"
		])
			.pipe(tsc(tsTestProject))
			.js.pipe(gulp.dest("tests/"));
	});

	gulp.task('build-css', function () {
		return gulp.src('source/styles/*.css')
			.pipe(autoprefixer({ browsers: ['last 2 versions'] }))
			.pipe(concat('myapp.min.css'))
			.pipe(cssnano({ zindex: false }))
			.pipe(gulp.dest("./dist/"));
	});

	gulp.task("build", function (cb) {
		runSequence(["build-app", "build-tests", "build-css"], cb);
	});

	//******************************************************************************
	//* TESTS
	//******************************************************************************
	gulp.task("istanbul:hook", function () {
		return gulp.src(['source/**/*.js'])
			// Covering files
			.pipe(istanbul())
			// Force 'require' to return covered files
			.pipe(istanbul.hookRequire());
	});

	gulp.task("test", ["istanbul:hook"], function () {
		return gulp.src('tests/**/*.spec.js')
			.pipe(mocha({ ui: 'bdd' }))
			.pipe(istanbul.writeReports());
	});

	//******************************************************************************
	//* BUNDLE
	//******************************************************************************
	gulp.task("bundle", function () {
		var libraryName = "myapp";
		var mainTsFilePath = "./source/main.js";
		var outputFolder = "./dist/";
		var outputFileName = libraryName + ".min.js";

		var bundler = browserify({
			debug: true,
			standalone: libraryName
		});

		return bundler.add(mainTsFilePath)
			.bundle()
			.pipe(source(outputFileName))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			//        .pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(outputFolder));
	});

	//******************************************************************************
	//* PACKAGE THE AZURE AD CALLBACK JAVASCRIPT MODULE
	//******************************************************************************
	gulp.task("package-oauth-callback", function () {
		var JsFiles = ["./source/callback.js"];
		var outputFolder = "./dist/";

		return gulp.src(JsFiles)
			.pipe(rename({ suffix: '.min' }))
			//        .pipe(uglify())
			.pipe(gulp.dest(outputFolder));
	});

	//******************************************************************************
	//* DEV SERVER
	//******************************************************************************
	gulp.task("serve", ["default"], function () {
		/** setup browserSync */
		browserSync.init({
			server: ".",
			port: 3000,
			/** uncomment the next line if you want to use https */
			//https: true
		});

		/** setup browser reload */
		gulp.watch(["source/styles/**/**.css", "source/**/**.ts", "tests/**/**.spec.ts"], ["default"]);
		gulp.watch(["dist/*.js", "dist/*.css", "./*.html"]).on('change', browserSync.reload);
	});

	//******************************************************************************
	//* DEFAULT
	//******************************************************************************
	gulp.task("default", function (cb) {
		runSequence("lint", "build", "test", "bundle", "package-oauth-callback", cb);
	});

})();

