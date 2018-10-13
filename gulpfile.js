let gulp = require('gulp')
let plumber = require('gulp-plumber')
let del = require('del')
let replace = require('gulp-replace')
let Path = require('path')
let chalk = require('chalk')
let stylus = require('gulp-stylus')
let runSequence = require('run-sequence')
let rename = require('gulp-rename')

const dist = './dist/**/*'
const src = './src/**/*'

const GLOB = {
  static: ['json','wxss','wxml'].map(item => `./src/**/*.${item}`),
  stylus: './src/**/*.styl'
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

// stylus
gulp.task('complieStylus', function(){
  return compileStylus(GLOB.stylus)
})

//wxml, wxss, json
gulp.task('copyStatic', function(){
  let glob = GLOB.static,
    stream = gulp.src(glob).pipe(gulp.dest('./dist'))
  return stream
})

gulp.task('default', function(cb){
  runSequence(
    'cleanDist',
    ['copyStatic', 'complieStylus'],
    function(){
      watch(GLOB.static, ['copyStatic'])
      watch(GLOB.stylus, ['complieStylus'])
      cb()
    }
  )
  
})
