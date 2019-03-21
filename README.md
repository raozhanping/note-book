# 个人知识补充

- [ demo ](#demo)
- [ git commit format ](#git-commit-format)
- [ getBoundingClientRect ](#getboundingclientrect)
- [ dispatchEvent ](#dispatchevent)
- [ JS滚轮事件(mousewheel/DOMMouseScroll) ](#js滚轮事件mousewheeldommousescroll))
    - [ 兼容差异 ](#兼容差异)


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

## 


