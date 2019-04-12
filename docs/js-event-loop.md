# Event Loop
- [参考文献](#参考文献)

## 定义
为了协调事件，用户交互，脚本，渲染，网络等，用户代理必须使用本节所述的event loop。  

## task
一个event loop有一个或者多个task队列。  
当用户代理安排一个任务，必须将该任务增加到相应的event loop的一个tsak队列中。  
每一个task都来源于指定的任务源，比如可以为鼠标、键盘事件提供一个task队列，其他事件又是一个单独的队列。可以为鼠标、键盘事件分配更多的时间，保证交互的流畅。  

**那些是 task 任务源**
1. DOM操作任务源： 此任务源被用来相应dom操作，例如一个元素以非阻塞的方式插入文档。
2. 用户交互任务源： 此任务源用于对用户交互作出反应，例如键盘或鼠标输入。响应用户操作的事件（例如click）必须使用task队列。
3. 网络任务源： 网络任务源被用来响应网络活动
4. history traversal任务源： 当调用history.back()等类似的api时，将任务插进task队列。

总结来说task任务源：  
- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

## microtask
每一个event loop都有一个microtask队列，一个microtask会被排进microtask队列而不是task队列。  
有两种microtasks：分别是solitary callback microtasks和compound microtasks。规范值只覆盖solitary callback microtasks。  


## 参考文献
- [从 event loop 规范探究 javaScript 异步及浏览器更新渲染时机](https://juejin.im/entry/59082301a22b9d0065f1a186)