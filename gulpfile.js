const {src, dest, watch, series, parallel} = require('gulp')
  browsersync = require('browser-sync')
  fileinclude = require('gulp-file-include')
  del = require('del')
  scss = require('gulp-sass')
  autoprefixer = require('gulp-autoprefixer')
  sourcemaps = require('gulp-sourcemaps')
  ttf2woff = require('gulp-ttf2woff')
  ttf2woff2 = require('gulp-ttf2woff2')
  babel = require('gulp-babel')

const paths = {
  input: 'src/**.html',
  output: 'dist/',
  styles: {
    input: 'src/assets/css/*.scss',
    output: 'dist/assets/css/',
    watch: 'src/assets/css/**/*.scss',
  },
  img: {
    input: 'src/assets/img/*.jpg',
    output: 'dist/assets/img/'
  },
  svg: {
    input: 'src/assets/svg/*.svg',
    output: 'dist/assets/svg/'
  },
  fonts: {
    input: 'src/assets/fonts/*.ttf',
    output: 'dist/assets/fonts/'
  },
  scripts: {
    input: 'src/assets/js/*',
    output: 'dist/assets/js/',
    watch: 'src/assets/js/*'
  }
}

function pages() {
  return src(paths.input)
    .pipe(fileinclude())
    .pipe(dest(paths.output))
    .pipe(browsersync.stream())
}

function styles() {
  return src(paths.styles.input)
    .pipe(sourcemaps.init())
    .pipe(scss().on('error', scss.logError))
    .pipe(autoprefixer({
      cascade: false,
      overrideBrowserslist: ['last 5 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.output))
    .pipe(browsersync.stream())
}

function fonts() {
  src(paths.fonts.input)
    .pipe(ttf2woff())
    .pipe(dest(paths.fonts.output))
  return src(paths.fonts.input)
    .pipe(ttf2woff2())
    .pipe(dest(paths.fonts.output))
}

function img() {
  return src(paths.img.input)
    .pipe(dest(paths.img.output))
    .pipe(browsersync.stream())
}

function scripts() {
  return src(paths.scripts.input)
    // .pipe(babel({
    //   presets: ["@babel/preset-env"]
    // }))
    .pipe(dest(paths.scripts.output))
    .pipe(browsersync.stream())
}

function sync() {
  browsersync.init({
    server: {baseDir: paths.output},
    notify: false,
    online: true
  })
  watch(paths.input, series(pages))
  watch(paths.styles.watch, series(styles))
  watch(paths.scripts.watch, series(scripts))
}

function clear() {
  return del(paths.output)
}

exports.fonts = fonts

exports.default = series(clear, pages, styles, fonts, img, scripts, sync)
