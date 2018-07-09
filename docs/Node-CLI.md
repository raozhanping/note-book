## Node.js 编写CLI

> Node.js 的应用场景有前后端分离、海量web页面渲染服务、命令行工具和桌面端应用等等。

### Why Node.js

1. npm OS 无关的包管理机制
2. npm 完善的生态系统
3. 对JavaScript 更加熟悉

### npm关联CLI的基本原理

在package.json里面增加一个bin字段。模块发布到npm上后，开发者安装这个包的时候会检查是否有bin字段，如果有bin字段则会使用软链接的方式创建可以全局使用的命令。  

如果模块采用全局安装的方式，对于类**unix**系统，会在`/usr/local/bin`目录创建软链接，对于**windows**系统，在`C:\Users\username\AppData\Roaming\npm目录创建软链接。  

如果模块采用局部安装的方式，则会在项目内的`./node_modules/.bin`目录创建软链接。  
配置好的package.json如下:  
```
"description": "A command line tool aims to improve front-end engineer workflow.",
"main": "lib/index.js",
"bin" : {
  "feflow" : "./bin/feflow"
}

```

### Feflow的技术架构

Feflow总体分为3个模块，包括**parser命令行参数解析**、**核心命令**以及**插件机制**。  
<img src="http://files.jb51.net/file_images/article/201705/201705171119488.jpg" alt="Feflow的技术架构">  
[【链接】](http://files.jb51.net/file_images/article/201705/201705171119488.jpg)

### 扫描器的实现

### 插件机制设计

```
feflow install <plugin>       #安装一个插件，--force则会强制安装
feflow remove <plugin>        #卸载一个插件
feflow list                   #列举所有插件信息
feflow list <plugin>          #列举某个插件信息
```

### 插件机制实现

> 插件机制的实现包括两个部分：插件注册机制和插件发现机制。  

feflow要求插件必须以`feflow-plugin-`开头或者`generator-`开头，generator作为一种特殊的插件，插件代码以npm包的形式存储和管理。运行feflow install plugin命令时，会通过npm的register检查是否存在插件，如果存在，会检查当前插件是否是最新版本。如果不是最新版本，则会提示用户是否需要更新。然后将插件下载到Home目录下的.feflow目录（windows系统为`C:\Users\username\.feflow`目录）下的node_modules里面，并且写入到配置文件里面。  

本地模块注册机制  
<img src="http://files.jb51.net/file_images/article/201705/2017051711194810.png" alt="本地模块注册机制">

本地模块发现机制  
<img src="http://files.jb51.net/file_images/article/201705/2017051711194811.jpg" alt="本地模块发现机制">

### 常用第三方包分享

1. osenv 方便获取不同系统的环境和目录配置
2. figlet 命令行炫酷的Logo生成器
3. meow 命令封装
4. inquire 强大的用户交互
5. chalk 让命令行的output带有颜色
6. easytable 表格信息展示，用于升级包的提示
7. minimlist 用户输入的参数解析
8. shelljs Node.js执行shell命令
9. clui 进度条

### 遇到问题

1. windows下用户未设置HOME环境变量导致报错  
解决办法: 由于windows下HOME环境变量并非默认存在，因此不能直接使用。判断process.platform === ‘win32'，优先使用HOME变量，否则使用USERPROFILE变量；建议使用osenv这个包。  
2. OSX平台运行feflow报错: env: node\r: No such file or directory  
解决办法: 由于类unix系统的换行符号为\n，而windows系统为\n\r。修复换行问题。可以在工程根目录下加.gitattributes文件，设置* text eol=lf，这样git提交时就不会讲LF转换成CRLF

