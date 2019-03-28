let gulp = require('gulp')
let del = require('del')
let chalk = require('chalk')
let runSequence = require('run-sequence')
let rename = require('gulp-rename')
let gulpWatch = require('gulp-watch')// gulp.watch 不能watch 新增的多层目录下的子文件
let stylus = require('gulp-stylus')// 支持stylus
let sass = require('gulp-sass')
let babel = require('gulp-babel') // 支持async/await
let pug = require('gulp-pug')
let imagemin = require('gulp-imagemin')
let sourcemaps = require('gulp-sourcemaps')// 微信开发者工具只支持行内sourcemap
let plumber = require('gulp-plumber')// stylus,babel编译抛出错误不退出

const dist = './dist/**/*'

const GLOB = {
  img: ['png', 'jpg', 'gif', 'jpeg'].map(item => `src/**/*.${item}`),
  static: ['json', 'wxss', 'wxml', 'wav', 'mp3', 'mp4'].map(item => `src/**/*.${item}`),
  stylus: 'src/**/*.styl',
  sass: 'src/**/*.scss',
  js: ['src/**/*.js', '!src/lib/**/*.js'],
  lib: 'src/lib/**/*.js', // 这部分js不经过babel编译，直接拷贝到dist中
  pug: 'src/**/*.pug'
}

function watch (glob) {
  return gulpWatch(glob, function (file) {
    console.log(`${file.path} has been ${chalk.green(file.event)}`)
  })
}

function compileStylus (stream) {
  return stream.pipe(plumber())
    .pipe(stylus())
    .pipe(rename(path => { path.extname = '.wxss' }))
    .pipe(gulp.dest('./dist'))
}

let sasswatch = null
function compileSass(stream){
  return stream.pipe(plumber())
  .pipe(sass().on('error', function(){
    //sass.logError(...arguments)
    console.log(chalk.red(arguments[0]))
    // TODO: 当node-sass编译错误后，这里无法再pipe数据到dist文件夹
    // 暂时的解决方案， 重启整个sass的watch
    if(sasswatch){
      sasswatch.close()
      compileSass(sasswatch = watch(GLOB.sass))
    }
  }))
  .pipe(rename(path => { path.extname = '.wxss' }))
  .pipe(gulp.dest('./dist'))
}

function minifyImage (stream) {
  return stream.pipe(imagemin())
    .pipe(gulp.dest('./dist'))
}

function copyStatic (stream) {
  return stream.pipe(gulp.dest('./dist'))
}

function compileJS (stream) {
  return stream.pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write()) // 开发者工具上传的时候会删除行内sourcemap
    .pipe(gulp.dest('./dist'))
}

function compilePug (stream) {
  return stream.pipe(plumber())
    .pipe(pug())
    .pipe(rename(path => { path.extname = '.wxml' }))
    .pipe(gulp.dest('./dist'))
}

function copyLib (stream) {
  return stream.pipe(gulp.dest('./dist/lib'))
}

gulp.task('cleanDist', function () {
  return del(dist)
})

// 图片压缩
gulp.task('minifyImage', function () {
  return minifyImage(gulp.src(GLOB.img))
})

// stylus --> wxss
gulp.task('compileStylus', function () {
  return compileStylus(gulp.src(GLOB.stylus))
})

// scss --> wxss
gulp.task('compileSass', function(){
  return compileSass(gulp.src(GLOB.sass))
})

// wxml, wxss, json
gulp.task('copyStatic', function () {
  return copyStatic(gulp.src(GLOB.static))
})

// lib/**/*.js
gulp.task('copyLib', function () {
  return copyLib(gulp.src(GLOB.lib))
})

// js
gulp.task('compileJS', function () {
  return compileJS(gulp.src(GLOB.js))
})

// pug --> wxml

gulp.task('compilePug', function () {
  return compilePug(gulp.src(GLOB.pug))
})

gulp.task('watch', function (cb) {
  copyStatic(watch(GLOB.static))
  copyLib(watch(GLOB.lib))
  compileStylus(watch(GLOB.stylus))
  compileSass(sasswatch = watch(GLOB.sass))
  compileJS(watch(GLOB.js))
  compilePug(watch(GLOB.pug))
  minifyImage(watch(GLOB.img))
  cb()
})

gulp.task('default', function (cb) {
  runSequence(
    'cleanDist',
    ['copyStatic', 'copyLib', 'compileStylus', 'compileSass', 'compileJS', 'compilePug', 'minifyImage'],
    'watch',
    function () {
      cb()
      console.log(chalk.green('为避免未知错误，需要重启微信开发者工具 ~~~ watching (ctrl + c 退出)'))
    }
  )
})

// 非watch,build项目文件
gulp.task('build', function (cb) {
  runSequence(
    'cleanDist',
    ['copyStatic', 'copyLib', 'compileStylus', 'compileSass', 'compileJS', 'compilePug', 'minifyImage'],
    function () {
      cb()
      console.log(chalk.green('generate success !!!'))
    }
  )
})
