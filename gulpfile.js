let gulp = require('gulp')
let del = require('del')
let Path = require('path')
let chalk = require('chalk')
let runSequence = require('run-sequence')
let rename = require('gulp-rename')
let replace = require('gulp-replace')
let stylus = require('gulp-stylus')// 支持stylus
let babel = require('gulp-babel') // 支持async/await
let pug = require('gulp-pug')
let imagemin = require('gulp-imagemin')
let sourcemaps = require('gulp-sourcemaps')// 微信开发者工具只支持行内sourcemap
let plumber = require('gulp-plumber')// stylus,babel编译抛出错误不退出

const dist = './dist/**/*'
const src = './src/**/*'

const GLOB = {
  img: ['png','jpg','gif', 'jpeg'].map(item => `./src/**/*.${item}`),
  static: ['json', 'wxss', 'wxml', 'wav', 'mp3', 'mp4'].map(item => `./src/**/*.${item}`),
  stylus: './src/**/*.styl',
  js: ['./src/**/*.js', '!./src/lib/**/*.js'],
  lib: './src/lib/**/*.js', // 这部分js不经过babel编译，直接拷贝到dist中
  pug: './src/**/*.pug'
}

function copyFile(file){  
  let distPath = file.replace(__dirname,'').replace('src', 'dist')
  distPath = Path.join(__dirname, distPath)
  del(distPath).then((paths) => {
    gulp.src(file).pipe(gulp.dest(paths[0]))
  })
}

function watch(glob, tasks){
  return gulp.watch(glob, tasks)
    .on('change', function(event){
      console.log('File ' + event.path + ' was ' + chalk.green(`${event.type}`) + ', running tasks...');
    })
}

function compileStylus(glob){
  return gulp.src(glob)
    .pipe(plumber())
    .pipe(stylus())
    .pipe(rename(path => path.extname = '.wxss'))
    .pipe(gulp.dest('./dist'))
}


gulp.task('cleanDist', function(){
  return del(dist)
})

// 图片压缩
gulp.task('minifyImage', function(){
  let glob = GLOB.img,
    stream = gulp.src(glob)
      .pipe(imagemin())
      .pipe(gulp.dest('./dist'))
})

// stylus --> wxss
gulp.task('complieStylus', function(){
  return compileStylus(GLOB.stylus)
})

//wxml, wxss, json
gulp.task('copyStatic', function(){
  let glob = GLOB.static,
    stream = gulp.src(glob).pipe(gulp.dest('./dist'))
  return stream
})

//lib/**/*.js 
gulp.task('copyLib', function () {
  let glob = GLOB.lib,
    stream = gulp.src(glob).pipe(gulp.dest('./dist/lib'))
  return stream
})

//js
gulp.task('compileJS', function(){
  let glob = GLOB.js,
    stream = gulp.src(glob)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(sourcemaps.write()) // 开发者工具上传的时候会删除行内sourcemap
      .pipe(gulp.dest('./dist'))
  return stream 
})

//pug --> wxml

gulp.task('compilePug', function(){
  let glob = GLOB.pug,
    stream = gulp.src(glob)
      .pipe(plumber())
      .pipe(pug())
      .pipe(rename(path => path.extname = '.wxml'))
      .pipe(gulp.dest('./dist'))
  return stream
})

gulp.task('default', function(cb){
  runSequence(
    'cleanDist',
    ['copyStatic', 'copyLib', 'complieStylus', 'compileJS', 'compilePug', 'minifyImage'],
    function(){
      watch(GLOB.static, ['copyStatic'])
      watch(GLOB.lib, ['copyLib'])
      watch(GLOB.stylus, ['complieStylus'])
      watch(GLOB.js, ['compileJS'])
      watch(GLOB.pug, ['compilePug'])
      watch(GLOB.img, ['minifyImage'])
      cb()
      console.log(chalk.green('为避免未知错误，需要重启微信开发者工具 ~~~ watching (ctrl + c 退出)'))
    }
  )
})

// 非watch,build项目文件
gulp.task('build', function(cb){
  runSequence(
    'cleanDist',
    ['copyStatic', 'copyLib', 'complieStylus', 'compileJS', 'compilePug', 'minifyImage'],
    function () {
      cb()
      console.log(chalk.green('generate success !!!'))
    }
  )
})
