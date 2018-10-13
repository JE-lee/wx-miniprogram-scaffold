let gulp = require('gulp')
let plumber = require('gulp-plumber')
let del = require('del')
let replace = require('gulp-replace')
let Path = require('path')
let chalk = require('chalk')

const dist = './dist/**/*'
const src = './src/**/*'


function copyFile(file){  
  let distPath = file.replace(__dirname,'').replace('src', 'dist')
  distPath = Path.join(__dirname, distPath)
  del(distPath).then((paths) => {
    gulp.src(file).pipe(gulp.dest(paths[0]))
  })
}

gulp.task('cleanDist', function(){
  return del(dist)
})

gulp.task('srcCopyToDist', ['cleanDist'], function(cb){
  gulp.src(src)
    .pipe(plumber())
    .pipe(gulp.dest('./dist'))
  cb()
})

gulp.task('default', ['srcCopyToDist'])

gulp.watch('./src/**/*').on('change', function (event) {
  console.log('File ' + event.path + ' was ' + chalk.green(`${event.type}`) + ', running tasks...');
  // 拷贝改变的文件
  copyFile(event.path)
})
