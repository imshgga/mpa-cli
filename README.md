# A boilerplate of vue for Multiple Page App.

## Why

虽然现在单页面应用比较多,但是单页面模板的扩展性比较差,如果有需要多建一个页面,就凉了.而多页面模板也可以用于适用单页面应用的开发.

## Usage

``` bash
npm install @shgga/mpa-cli -g

mpa init project-name

// For JDer
mpa init project-name -j
```

## Features

一个在vue-cli基础上改动的多页面模板.

1. Build to Multiple Pages

src下pages文件夹里面一个js文件会打包成一个独立的页面,页面名称与js文件名相同.建议pages下面文件夹名称与js文件名称相同.

2. Mobile Web is available.

支持移动端rem页面适配.css里面单位直接用750设计图的设计尺寸,会经过postcss自动转换为rem,根字体大小16pt. 如设计图320px,对应160pt,会转换为10rem.相关逻辑在index.html里.

3. Default & Custom html template for every page

默认html模板文件为跟目录下index.html.如果js文件同级目录中有html文件,那么会使用该文件作为模板

4. Copy files in '/static' to custom path.

static文件夹下资源会拷贝到dist/static下

## ChangeLog

##### v1.03
+ fixed 京东专属模板下载的问题

-----

##### v1.02
+ 添加京东人专属模板.(需内网使用)

## License

MIT
