let Generator = require('yeoman-generator')
let path = require('path')
let chalk = require('chalk')
let config = require('../config')

const prompt = [
  {
    type: 'input',
    name: 'projectname',
    message: 'Your weixin miniprogram project name',
    default: ''
  },
  {
    type: 'input',
    name: 'appid',
    message: 'Your weixin miniprogram appid',
    default: ''
  },
  {
    type: 'confirm',
    name: 'cool',
    message: 'Would you like to enable the async/await feature? (That takes up a couple of kilobytes of space)',
    default: false
  }
]

module.exports = class extends Generator {
  async prompting () {
    this.answers = await this.prompt(prompt)
  }
  writing () {
    // 拷贝templates/src中的文件
    let templatePath = this.templatePath()
    let destinationPath = this.destinationPath()

    let glob = [
      path.join(templatePath, '**'),
      `!${path.join(templatePath, 'project.config.json')}`,
      `!${path.join(templatePath, 'src/app.js')}`
    ]

    if (!this.answers.cool) {
      glob.push(`!${path.join(templatePath, 'src/lib/**')}`)
    }
    // 是否启用async/await 特性
    this.fs.copy(glob, destinationPath, { ignoreNoMatch: true })
    config.files.forEach(file => {
      this.fs.copy(path.join(templatePath, file), path.join(destinationPath, file), { ignoreNoMatch: true })
    })

    // 根据用户的自定义选项修改
    // project.config.json
    let projectJsonPath = path.join(destinationPath, 'project.config.json')
    let projectJson = this.fs.readJSON(projectJsonPath)
    projectJson.appid = this.answers.appid
    projectJson.projectname = this.answers.projectname
    this.fs.writeJSON(projectJsonPath, projectJson)

    // src/app.js
    let appJs = this.answers.cool ? 'require(\'./lib/index\')\nApp({})' : 'App({})'
    this.fs.write(path.join(destinationPath, 'src/app.js'), appJs)
  }
  install () {
    this.spawnCommandSync('npm install')
  }
  end () {
    console.log(chalk.green('generate sucess'))
  }
}

