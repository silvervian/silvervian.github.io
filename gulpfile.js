/* eslint-disable prefer-destructuring */
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean-css');
const browserSync = require('browser-sync');
const del = require('del');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const sourceMaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const sync = browserSync.create();
const reload = sync.reload;
const config = {
  paths: {
    src: {
      html: './src/**/*.html',
      img: './src/img/**.*',
      sass: ['./src/sass/main.scss'],
      js: [
        './src/js/lol.js',
        './src/js/app.js'
      ]
    },
    dist: {
      main: './dist',
      css: './dist/css',
      js: './dist/js',
      img: './dist/img'
    }
  }
};

gulp.task('sass', () => gulp.src(config.paths.src.sass)
  .pipe(sourceMaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 5 versions']
  }))
  .pipe(clean({
    rebaseTo: './css/'
  }))
  .pipe(sourceMaps.write())
  .pipe(gulp.dest(config.paths.dist.css))
  .pipe(sync.stream()));

gulp.task('js', (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log(err.toString());
    }

    console.log(stats.toString());
    callback();
  });

  reload();
});

gulp.task('static', () => {
  gulp.src(config.paths.src.html)
    .pipe(gulp.dest(config.paths.dist.main));

  reload();
});

gulp.task('image', () => {
  gulp.src(config.paths.src.img)
    .pipe(changed(config.paths.dist.img))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 7 }),
      imagemin.svgo({
        plugins: [{ removeViewBox: false },
          { cleanupIDs: false },
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false },
          { removeEmptyAttrs: false }
        ]
      })
    ], { verbose: true }))
    .pipe(gulp.dest(config.paths.dist.img));

  reload();
});

gulp.task('clean', () => del([config.paths.dist.main]));

gulp.task('build', ['clean'], () => {
  gulp.start('sass', 'js', 'static', 'image');
});

gulp.task('server', () => {
  sync.init({
    injectChanges: true,
    server: config.paths.dist.main
  });
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/sass/**/**/*.scss', ['sass']);
  gulp.watch('src/img/**/*.*', ['image']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/*.html', ['static']);
  gulp.start('server');
});

gulp.task('default', ['build']);
