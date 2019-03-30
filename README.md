# 个人知识补充

- [个人知识补充](#%E4%B8%AA%E4%BA%BA%E7%9F%A5%E8%AF%86%E8%A1%A5%E5%85%85)
  - [TODO:](#todo)
  - [git commit format](#git-commit-format)
  - [getBoundingClientRect](#getboundingclientrect)
  - [dispatchEvent](#dispatchevent)
  - [JS滚轮事件(mousewheel/DOMMouseScroll)](#js%E6%BB%9A%E8%BD%AE%E4%BA%8B%E4%BB%B6mousewheeldommousescroll)
    - [兼容差异](#%E5%85%BC%E5%AE%B9%E5%B7%AE%E5%BC%82)
  - [实现一个 new 操作符](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA-new-%E6%93%8D%E4%BD%9C%E7%AC%A6)
  - [实现一个JSON.stringify](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAjsonstringify)
  - [实现一个JSON.parse](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAjsonparse)
  - [实现一个call或 apply](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAcall%E6%88%96-apply)
  - [实现一个Function.bind](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAfunctionbind)
  - [实现一个继承](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%BB%A7%E6%89%BF)
  - [实现一个JS函数柯里化](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAjs%E5%87%BD%E6%95%B0%E6%9F%AF%E9%87%8C%E5%8C%96)
  - [手写一个Promise(中高级必考)](#%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AApromise%E4%B8%AD%E9%AB%98%E7%BA%A7%E5%BF%85%E8%80%83)
  - [手写防抖(Debouncing)和节流(Throttling)](#%E6%89%8B%E5%86%99%E9%98%B2%E6%8A%96debouncing%E5%92%8C%E8%8A%82%E6%B5%81throttling)
  - [手写一个JS深拷贝](#%E6%89%8B%E5%86%99%E4%B8%80%E4%B8%AAjs%E6%B7%B1%E6%8B%B7%E8%B4%9D)
  - [实现一个instanceOf](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAinstanceof)
  - [参考文献](#%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)


## TODO:
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


## 实现一个 new 操作符
new 操作符：  
- 创建一个新对象
- 将 this 指向新对象
- 通过 new 创建的对象最终被 [[Prototype]] 链接到这个函数的 prototype 对象上
- 如果函数没有返回对象类型(Function, Array, Date, RegExg, Error), 返回这个新对象引用

```Javascript
function New(func) {
    var newObj = {};

    if (func.prototype !== null) {
        newObj.__proto__ = func.prototype;
    }
    var result = func.apply(newObj, Array.prototype.slice.call(arguments, 1));
    if ((typeof result === 'object' || typeof result === 'function') && result !== null) {
        return result;
    }
    return newObj;
}
```

## 实现一个JSON.stringify
JSON.stringify:  
- Boolean | Number | String 类型会自动转换为对应的原始值
- undefined、任意函数和symbol，会被忽略（出现在非数组对象的属性值中时），或者被转换成 null（出现在数组中时）
- 不可枚举的属性会被忽略
- 如果一个对象的属性值通过某种间接的方式指回该对象本身，及循环引用，属性会被忽略。

```Javascript
// FIXME: 不够完善， 传入 Date 和 RegExg Error
function jsonStringify(obj) {
    var type = typeof obj;
    if (type !== "object" || type === null) {
        if (/string|undefined|function/.test(type)) {
            obj = '"' + obj + '"';
        }
        return String(obj);
    } else {
        var json = [];
        var arr = (obj && obj.constructor === Array);
        for (let k in obj) {
            let v = obj[k];
            let type = typeof v;
            if (/string|undefined|function/.test(type)) {
                v = '"' + v + '"';
            } else if (type === "object") {
                v = jsonStringify(v);
            }
            json.push((arr ? "" : '"' + k + '":') + String(v));
        }

        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}
```


## 实现一个JSON.parse
## 实现一个call或 apply
## 实现一个Function.bind
## 实现一个继承
## 实现一个JS函数柯里化
## 手写一个Promise(中高级必考)
## 手写防抖(Debouncing)和节流(Throttling)
## 手写一个JS深拷贝
## 实现一个instanceOf


## 参考文献
1. [「中高级前端面试」JavaScript手写代码无敌秘籍](https://juejin.im/post/5c9c3989e51d454e3a3902b6)


