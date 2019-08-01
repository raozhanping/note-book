#  编写插件 

## 基础插件
### 编写示例
```js
class BasicPlugin {
    // 从构造函数中获取用户设置的配置
    constructor (options) {

    }
    // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
    apply (compiler) {
        compiler.hooks.compilation.tap('BasicPlugin', compilation => {

        })
    }
}

// 导出 Plugin
module.exports = BasicPlugin
```

### 使用示例
```js
const BasicPlugin = require('./BasicPlugin.js')

module.exports = {
    plugins: [
        new BasicPlugin(options)
    ]
}
```

## Compiler 和 Compilation
- Compiler  
Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例  
- Compilation  
Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象  
- 区别  
Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译

## 事件流
### 开发插件时注意事项
- 只要能拿到 Compiler 或 Compilation 对象，就能广播出新的事件，所以在新开发的插件中也能广播出事件，给其它插件监听使用
- 传给每个插件的 Compiler 和 Compilation 对象都是同一个引用。也就是说在一个插件中修改了 Compiler 或 Compilation 对象上的属性，会影响到后面的插件
- 有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知 Webpack，才会进入下一处理流程(v3.8.1)

## 常用 API
### 读取输出资源、代码块、模块及其依赖
```js
class Plugin {
    apply (compiler) {
        compliler.hooks.emit('Plugin', compilation => {
            // 存放所有代码块，是一个数组
            compilation.chunks.forEach(function (chunk) {
                // chunk 代表一个代码块
                // 代码块有多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
                chunk.forEachModule(module => {
                    // module 代表一个模块
                    // module.fileDependencies 存在当前模块的所有依赖的文件路径，是一个[]
                    module.fileDependenciew.forEach(filepath => {

                    })
                })
            })
        })

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function (filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        })

    }
}
```

### 监听文件变化
```js
// // 当依赖的文件发生变化时会触发 watch-run 事件
compiler.hooks.watchRun.tap('Plugin', watching => {
     // 获取发生变化的文件列表
    const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes
    // changedFiles 格式为键值对，键为发生变化的文件路径。
    if (changedFiles[filePath] !== undefined) {
      // filePath 对应的文件发生了变化
    }
})
```
```js
compiler.hooks.afterCompile.tap('Plugin', (compilation) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
  compilation.fileDependencies.push(filePath)
})
```

### 修改输出资源
```js
compiler.hooks.emit.tap('Plugin', (compilation) => {
  // 设置名称为 fileName 的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
      return fileContent;
      },
    // 返回文件大小
      size: () => {
      return Buffer.byteLength(fileContent, 'utf8');
    }
  }

  // 读取 compilation.assets
  // 读取名称为 fileName 的输出资源
  const asset = compilation.assets[fileName]
  // 获取输出资源的内容
  asset.source()
  // 获取输出资源的文件大小
  asset.size()
})
```

### 判断 Webpack 使用了哪些插件
```js
// 判断当前配置使用使用了 ExtractTextPlugin，
// compiler 参数即为 Webpack 在 apply(compiler) 中传入的参数
function hasExtractTextPlugin(compiler) {
  // 当前配置所有使用的插件列表
  const plugins = compiler.options.plugins;
  // 去 plugins 中寻找有没有 ExtractTextPlugin 的实例
  return plugins.find(plugin=>plugin.__proto__.constructor === ExtractTextPlugin) != null;
}
```