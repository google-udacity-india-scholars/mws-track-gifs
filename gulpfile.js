/**
 *  To use this file you need to have gulp installed. To install gulp you can use command 'npm i gulp-cli -g'.
 *
 * 'gulp' alone minifies code
 * 'gulp clean' removes all the files and folders in prod folder
 * 'gulp minify-html' minifies html
 * 'gulp minify-css' minifies css
 * 'gulp minify-js' minifies js
 * 'gulp browser-sync' starts server
 */

const gulp = require('gulp');

const eslint = require('gulp-eslint');
const babel = require('gulp-babel');

const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const pump = require('pump');
const clean = require('gulp-clean');

// Clean the files and folders in prod folder
gulp.task('clean', () => {
  return gulp.src('prod', {read: false})
    .pipe(clean());
});

gulp.task('copy', () => {
  gulp.src(['manifest.json'])
    .pipe(gulp.dest('prod'));
  gulp.src('./icon/**/*')
    .pipe(gulp.dest('prod/icon'));
  gulp.src('./img/**/*')
    .pipe(gulp.dest('prod/img'));
});

// Minify HTML
gulp.task('minify-html', () => {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('prod'));
});

// Minify CSS
gulp.task('minify-css', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('prod/css'));
});

// Minify JS
gulp.task('minify-js', (cb) => {
  pump([
    gulp.src('js/*.js'),
    eslint(),
    eslint.format(),
    eslint.failAfterError(),
    babel({
      presets: ['@babel/env']
    }),
    uglify(),
    gulp.dest('prod/js')
  ]);
  pump([
    gulp.src('service-worker.js'),
    eslint(),
    eslint.format(),
    eslint.failAfterError(),
    babel({
      presets: ['@babel/env']
    }),
    uglify(),
    gulp.dest('prod')
  ],
  cb
  );
});

// Server for development that watches and reloads on file changes
gulp.task('browser-sync', () => {
  browserSync.init({
    server: ['./']
  });

  gulp.watch('css/*.css').on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// Default task for gulp
gulp.task('default', ['copy', 'minify-html', 'minify-css', 'minify-js']);