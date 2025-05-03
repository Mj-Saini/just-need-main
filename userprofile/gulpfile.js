const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cssmin = require("gulp-cssmin");
const browserSync = require("browser-sync").create();

gulp.task("sass", function () {
  return gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

gulp.task("html", function () {
  return gulp
    .src("src/html/**/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("js", function () {
  return gulp
    .src("src/js/*.js")
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

gulp.task("assets", function () {
  return gulp.src("src/assets/**/*").pipe(gulp.dest("dist/assets"));
});

gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("src/html/**/*.html", gulp.series("html"));
  gulp.watch("src/js/*.js", gulp.series("js"));
  gulp.watch("src/assets/**/*", gulp.series("assets"));
});

gulp.task("default", gulp.series("sass", "html", "js", "assets", "watch"));
