#!/usr/bin/env node
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const spinner = ora('正在下载模板...')
const chalk = require('chalk')
const symbols = require('log-symbols')
const fs = require('fs')
const handlebars = require('handlebars')

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
      choices: [ "pc", "mobile" ]
    }
  ]).then(({author, description, platform}) => {
    program.version('1.0.2', "-v, --version")
      .command('init <name>')
      .option('-j, --JDer', '是否下载京东内部模板')
      .action((name, cmd) => {
        let downloadUrl = cmd.JDer ?
          'direct:http://minner.jr.jd.com/spe/mpa-templete/dist/mpa.zip' :
          'imshgga/MPA-for-vue'

        if(!fs.existsSync(name)) {
          spinner.start()

          download(downloadUrl, name, error => {
            if (error) {
              spinner.fail()
              console.log(symbols.error, chalk.red('项目创建失败'))
              return
            }

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
              console.log(require('./str.js')(name))
            } catch (e) {
              console.log(JSON.stringify(e))
              spinner.stop()
            }
          })
        } else {
          console.log(symbols.error, chalk.red('下载模板失败,项目已存在...'))
        }

      })
    program.parse(process.argv)
  })
})
