# 速记

- [速记](#%e9%80%9f%e8%ae%b0)
  - [TODO:](#todo)
  - [git commit format](#git-commit-format)
  - [getBoundingClientRect](#getboundingclientrect)
  - [dispatchEvent](#dispatchevent)
  - [JS滚轮事件(mousewheel/DOMMouseScroll)](#js%e6%bb%9a%e8%bd%ae%e4%ba%8b%e4%bb%b6mousewheeldommousescroll)
    - [兼容差异](#%e5%85%bc%e5%ae%b9%e5%b7%ae%e5%bc%82)
  - [渲染10k条记录](#%e6%b8%b2%e6%9f%9310k%e6%9d%a1%e8%ae%b0%e5%bd%95)
  - [window.requestIdleCallback()](#windowrequestidlecallback)

## TODO:
1. [ 按位操作 ](./docs/js-bitwise-operation.md)
2. [ 代理(Proxy)和反射(Reflection) ](./docs/js-es6-proxy.md)
3. [ Ubuntu开发环境安装 ](docs/tool-ubuntu-env.md)

## git commit format
```javascript
<type>(<scope>): <subject>
// 空一行
<body>

//type（必需）、scope（可选）和subject（必需）
//<body>(可选)
```
- type用于说明 commit 的类别，只允许使用下面8个标识。
- br: 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
- revert: feat(pencil): add 'graphiteWidth' option (撤销之前的commit)

## getBoundingClientRect

## dispatchEvent
创建(`createEvent`)-初始(`init*Event`)-分派(`dispatchEvent`)

## JS滚轮事件(mousewheel/DOMMouseScroll)
### 兼容差异
1. onmousewheel(Other) / DOMMouseScroll(FF)
    包括IE6在内的浏览器是使用onmousewheel，而FireFox浏览器一个人使用DOMMouseScroll. 经自己测试，即使现在FireFox 19下，也是不识onmousewheel  
2. event.wheelDelta(Other) / event.detail(FF)

需要注意的是，FireFox浏览器的方向判断的数值的正负与其他浏览器是相反的。FireFox浏览器向下滚动是正值，而其他浏览器是负值。

## 渲染10k条记录
- Large number of DOM nodes make rendering slow
- JavaScript arrays can handle large data sets
- Looping through large arrays is fast
- Sorting arrays by providing custom function to Array.sort() is fast
- eval() is slow, should not be used in large loops
- To achieve smooth scrolling render a few hidden records on top and bottom outside of the visible area

## window.requestIdleCallback()
> 会在浏览器空闲时期依次调用函数， 这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这样延迟敏感的事件产生影响。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序

```javascript
var handle = window.requestIdleCallback(callback[, options])

window.cancelIdleCallback(handle)
```
