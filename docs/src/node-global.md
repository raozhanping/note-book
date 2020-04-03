## NODEJS

## Node.js 的全局对象和全局变量

### 全局对象

1. **global**: 表示 Node 所在的全局环境，类似于浏览器中的 window 对象。
2. **process**: 指向 Node 内置的 process模块，允许开发者与当前进程互动。(process.exit());
3. **console**: 指向 Node 内置的 console 模块，提供命令行环境中的标准、标准输出环境。(console.log())

### 全局函数

1. **定时器函数**: setTimeout(), clearTimeout(), setInterval(), clearInterval().
2. **require**: 用于加载模块。

### 全局变量

1. **__filename**: 指向当前运行的脚本文件名。
2. **__dirname**:  指向当前运行的脚本所在的目录。

### 准全局变量

模块内部的局部变量，指向的对象根据模块不同而不同，但是所有模块都适用，可以看作是伪全局变量，主要为 **module**, **module.exports** , **exports** 等。  

**module** 变量指代当前模块。module.exports变量表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取module.exports变量。  

  1. **module.id** 模块的识别符，通常是模块的文件名。  
  2. **module.filename** 模块的文件名。  
  3. **module.loaded** 返回一个布尔值，表示模块是否已经完成加载。  
  4. **module.parent** 返回使用该模块的模块。  
  5. **module.children** 返回一个数组，表示该模块要用到的其他模块。  

这里需要特别指出的是，exports变量实际上是一个指向 **module.exports** 对象的链接，等同在每个模块头部，有一行这样的命令。  

```
var exports = module.exports;
```

这造成的结果是，在对外输出模块接口时，可以向exports对象添加方法，但是不能直接将exports变量指向一个函数：  

```
exports = function (x){ console.log(x);};
```

上面这样的写法是无效的，因为它切断了exports与module.exports之间的链接。但是，下面这样写是可以的。

```
exports.area = function (r) {  
  return Math.PI * r * r;  
};  
  
exports.circumference = function (r) {  
  return 2 * Math.PI * r;  
};  
```