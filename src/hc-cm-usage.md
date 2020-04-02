## CSS Modules

为了让 CSS 能够适用软件工程方法，程序员想了各种方法，让他变得像一门编程语言。从最早的 Less、 SASS，到后来的 PostCSS，再到最近的 CSS in JS，都是为了解决这个问题。  

而 CSS Modules 不同于上述。他不是将 CSS 改造成编程语言，而是功能很单纯，只加入了局部作用域和模块依赖，这恰恰是网页组件最急需的功能。  

### 局部作用域

CSS 的规则都是全局的，任何一个组件的样式规则，都对整个网页有效。  

产生局部作用域的唯一方法，就是使用一个独一无二的 class 的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。  

```
import React from 'react';
import style form './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World!
    </h1>
  );
}
```

### 全局作用域

CSS Modules 允许使用 :global(.className)的语法，声明一个全局规则。凡是这样声明的class，都不会被编译成hash字符串。  

```
.title {
  color: red;
}

:global(.title) {
  color: green;
}
```

```
import React from 'react';
import styles from './App.css';

export defalut () => {
  return (
    <h1 className="title">
      Hello World
    </h1>
  );
}
```

### 定制哈希类明
css-loader 默认的哈希算法是[hash:base64]，这会将.title编译成._3zyde4l1yATCOkgn-DBWEL这样的字符串。  

```
module: {
  loaders: [
    // ...
    {
      test: /\.css$/,
      loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
    },
  ]
}
```

### Class的组合

在 CSS Modules中，一个选择器可以继承另一个选择器的规则，这称为“组合”（compositoion）。  

```
.className {
  background-color: blue;
}

.title {
  composes: className;
  color: red;
}
```

### 输入其他模块

选择器也可以继承其他CSS文件里面的规则。  

```
.title {
  composes: className from './another.css';
  color: red;
}
```

### 输入变量

CSS Modules 支持使用变量，不过需要安装 PostCSS 和 postcss-modules-values.  

把 post-loader 加入 webpack.config.js.  
```
var values = require('postcss-modules-values');

module.exports = {
  entry: __dirname + '/index.js',
  output: {
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules!postcss-loader"
      },
    ]
  },
  postcss: [
    values
  ]
};

```