let gulp = require('gulp')
let path = require('path')
let del = require('del')
let fs = require('fs')

// 复制模板文件到yeoman的模板文件夹
let templatePath = path.resolve(__dirname, '..')
let files = [
  '.babelrc',
  '.editorconfig',
  '.eslintignore',
  '.eslintrc.js',
  '.gitattributes',
  'create-page.js',
  'gulpfile.js',
  'package.json',
  'project.config.json'
]
async function copyFile (source, dest) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(source).pipe(fs.createWriteStream(dest))
      .on('finish', resolve)
      .on('error', reject)
  })
}

async function update () {
  await del(path.join(__dirname, 'app/templates/**/*'))
  // 拷贝src文件夹
  gulp.src(path.join(templatePath, 'src/**'))
    .pipe(gulp.dest(path.join(templatePath, 'generator-wxminiprogram/app/templates/src')))
    .on('finish', function () {
      let dest = path.join(__dirname, 'app/templates')
      Promise.all(files.map(file => {
        return copyFile(path.join(templatePath, file), path.join(dest, file))
      })).then(() => {
        console.log('update finish')
      })
    })
}

update()
