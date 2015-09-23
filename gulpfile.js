var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var runServe = function runServe() {

  browserSync.init({
    ui: false,
    server: {
      baseDir: "./"
    },
    port: 8999,
    ghostMode: false,
    logPrefix: "Js Simple Project"
  });
};

var runWatch = function runWatch() {
  gulp.watch("*.html").on('change', reload);
  gulp.watch("*.css").on('change', reload);
  gulp.watch("*.js").on('change', reload);
};

gulp.task('serve', runServe);
gulp.task('watch', runWatch);

gulp.task('default', ['serve', 'watch']);