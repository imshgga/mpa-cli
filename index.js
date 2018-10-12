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
    console.log(author, '  ', description, '  ', platform)

    program.version('1.0.0', "-v, --version")
      .command('init <name>')
      .action(name => {
        if(!fs.existsSync(name)) {
          spinner.start()
          download('imshgga/MPA-for-vue', name, {clone: true}, error => {
            {
              const meta = {
                name,
                author,
                description
              }
              const filename = `${name}/package.json`
              const content = fs.readFileSync(filename).toString()
              const result = handlebars.compile(content)(meta)
              fs.writeFileSync(filename, result)
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

            if (error) {
              spinner.fail()

              console.log(symbols.error, chalk.red('项目创建失败'))
            } else {
              spinner.succeed()

              console.log(symbols.success, chalk.green('项目创建成功'))
              console.log(`
    To get start

        cd ${name}
        npm install
        npm start

    and then open
        http://0.0.0.0:8080/withTemplate.html
    or
        http://0.0.0.0:8080/withoutTemplate.html
              `)
            }
          })
        } else {
          console.log(symbols.error, chalk.red('下载模板失败,项目已存在...'))
        }

      })
    program.parse(process.argv)
  })
})
