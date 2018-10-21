#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const ora = require('ora')
const spinner = ora('正在下载模板...')
const chalk = require('chalk')
const symbols = require('log-symbols')
const fs = require('fs')
const handlebars = require('handlebars')
const download = require('download')

inquirer.prompt([
  {
    name: 'currentDir',
    message: '是否在当前目录下建立模板',
    type: 'confirm'
  }
]).then(({currentDir}) => {
  if (!currentDir) return

  inquirer.prompt([
    {
      name: 'description',
      message: '项目描述'
    },
    {
      name: 'author',
      message: '开发者'
    },
    {
      name: 'platform',
      message: '这是什么应用?',
      type: 'list',
      choices: [ "mobile", "pc" ]
    }
  ]).then(({author, description, platform}) => {
    program.version('1.0.2', "-v, --version")
      .command('init <name>')
      .option('-j, --JDer', '是否下载京东内部模板')
      .action((name, cmd) => {
        let url = cmd.JDer ?
          'http://minner.jr.jd.com/spe/mpa-templete/dist/mpaa.tar' :
          'https://github.com/imshgga/MPA-for-vue/archive/master.zip'

        let options = cmd.JDer ?
          { extract: true, mode: '666'} :
          { extract: true, strip: 1, mode: '666'}

        download(url, name, options).then((data) => {
          try {
            {
              const meta = {
                name,
                author,
                description
              }
              const content = fs.readFileSync(`${name}/package.temp.json`).toString()
              const result = handlebars.compile(content)(meta)
              fs.writeFileSync(`${name}/package.json`, result)
              fs.unlink(`${name}/package.temp.json`, error => {
                if (error) throw error
              })
            }

            {
              fs.renameSync(`${name}/.postcssrc.${platform}.js`, `${name}/.postcssrc.js`)
              fs.renameSync(`${name}/index.${platform}.html`, `${name}/index.html`)

              let unlink = platform === 'pc' ? 'mobile' : 'pc'
              fs.unlink(`${name}/.postcssrc.${unlink}.js`, error => {
                if (error) throw error
              })
              fs.unlink(`${name}/index.${unlink}.html`, error => {
                if (error) throw error
              })
            }

            spinner.succeed()
            console.log(symbols.success, chalk.green('项目创建成功'))
            console.log(tips(name))
          } catch (e) {
            console.log(JSON.stringify(e))
            spinner.stop()
          }
        })
        .catch(function (err) {
          console.log(JSON.stringify(err))
          spinner.stop()
        })
      })
    program.parse(process.argv)
  })
})

function tips (name) {
  return `
      To get start

      cd ${name}
      npm install
      npm start

      and then open
      http://0.0.0.0:8080/withTemplate.html
      or
      http://0.0.0.0:8080/withoutTemplate.html
  `
}
