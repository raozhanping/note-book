# 个人知识补充

- [个人知识补充](#%E4%B8%AA%E4%BA%BA%E7%9F%A5%E8%AF%86%E8%A1%A5%E5%85%85)
  - [TODO:](#todo)
  - [git commit format](#git-commit-format)
  - [getBoundingClientRect](#getboundingclientrect)
  - [dispatchEvent](#dispatchevent)
  - [JS滚轮事件(mousewheel/DOMMouseScroll)](#js%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6mousewheeldommousescroll)
    - [兼容差异](#%E5%85%BC%E5%AE%B9%E5%B7%AE%E5%BC%82)
  - [渲染10k条记录](#%E6%B8%B2%E6%9F%9310k%E6%9D%A1%E8%AE%B0%E5%BD%95)
  - [window.requestIdleCallback()](#windowrequestidlecallback)
  - [IntersectionObserver API](#intersectionobserver-api)
    - [API](#api)
    - [callback 参数](#callback-%E5%8F%82%E6%95%B0)
    - [IntersectionObserverEntry 对象](#intersectionobserverentry-%E5%AF%B9%E8%B1%A1)
    - [Option 对象](#option-%E5%AF%B9%E8%B1%A1)


## TODO:
- [ x ] 软件系统管理
- [ x ] 正则表达式 => \w\W\d\D\s\S
- [ x ] javascript => 设计模式
- [ x ] script template 在不在render tree上
- [ x ] animated css 对 dom 的性能优化
- [ x ] CSS3
- [ x ] css animate
- [ x ] conventional-changelog(npm)

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

## IntersectionObserver API
>传统的实现方法是:
>监听到scroll事件后，调用目标元素（绿色方块）的getBoundingClientRect()方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于scroll事件密集发生，计算量很大，容易造成性能问题。
> 交叉观察器

### API
```javascript
// 开始观察
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();
```

### callback 参数
> callback一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）

### IntersectionObserverEntry 对象
```javascript
{
  time: 3893.92,
  rootBounds: ClientRect {
    bottom: 920,
    height: 1024,
    left: 0,
    right: 1024,
    top: 0,
    width: 920
  },
  boundingClientRect: ClientRect {
     // ...
  },
  intersectionRect: ClientRect {
    // ...
  },
  intersectionRatio: 0.54,
  target: element
}
```

- time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- target：被观察的目标元素，是一个 DOM 节点对象
- rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
- boundingClientRect：目标元素的矩形区域的信息
- intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
- intersectionRatio：目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0

### Option 对象
- threshold: 设置门槛,触发回调函数  
```javascript
new IntersectionObserver(
  entries => {/* ... */}, 
  {
    threshold: [0, 0.25, 0.5, 0.75, 1]
  }
);
```
- root: 容器  
- rootMargin: 它使用CSS的定义方法，比如10px 20px 30px 40px，表示 top、right、bottom 和 left 四个方向的值,用来扩展或缩小rootBounds这个矩形的大小


