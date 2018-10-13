let parse = require('minimist')
let chalk = require('chalk')
let path = require('path') 
let stream = require('stream')
let mkDir = require('make-dir')
let fs = require('fs')
let jsonFormat = require('json-format')

let argv = process.argv.slice(2)

const appJSON = path.join(__dirname, './src/app.json')

function saveStrToFile(str, filePath, force = false){
  let fileStream = new stream.PassThrough(),
    isExsit = false 
  fileStream.end(str)
  // 如果文件存在，直接返回
  try {
    isExsit = fs.statSync(filePath).isFile()
  }catch(err){
    //console.log('err', err)
  }
  
  if(!isExsit || force){
    return new Promise((resolve, reject) => {
      fileStream.pipe(fs.createWriteStream(filePath))
      .on('finish', resolve)
      .on('error', reject)
    })
  } else {
    return Promise.resolve()
  }
}

// pug
async function createPug(where){
  let pugPath = path.parse(where),
    str = 'text() pug 模板'

  await mkDir(pugPath.dir)
  await saveStrToFile(str, where)
}

// json
async function createJSON(where){
  let jsonPath = path.parse(where),
    str = jsonFormat({
      navigationBarTitleText: '测试页面'
    })

  await mkDir(jsonPath.dir)
  await saveStrToFile(str, where)
}

//styl
async function createStylus(where){
  let stylusPath = path.parse(where),
    str = ''

  await mkDir(stylusPath.dir)
  await saveStrToFile(str, where)
}

// js
async function createJS(where){
  let jsPath = path.parse(where),
    str = 'page({})'

  await mkDir(jsPath.dir)
  await saveStrToFile(str, where)
}

// 修改app.json
async function modifyAppJSON(pagePath){
  let json = JSON.parse(fs.readFileSync(appJSON))
  if(json.pages.findIndex(item => item === pagePath) == -1){
    json.pages.push(pagePath)
  }
  
  await saveStrToFile(jsonFormat(json), appJSON, true)
}

(async function() {
  let { _: params } = parse(argv),
    pageName = params[0] || 'page'
    pagePath = params[1] ? path.posix.join('src', params[1]) : './src/pages',
    finalPath = path.posix.join(pagePath, pageName, pageName)
  console.log('finalPath', finalPath)
  try {
    await createPug(`${finalPath}.pug`)
    await createJSON(`${finalPath}.json`)
    await createStylus(`${finalPath}.styl`)
    await createJS(`${finalPath}.js`)
    await modifyAppJSON(finalPath.slice(finalPath.indexOf('/') + 1))
    console.log(chalk.green(`page ${finalPath} generate success.`))
  } catch (error) {
    console.log('error', error)  }
})()

