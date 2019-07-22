# 模块曝光事件
- [模块曝光事件](#%E6%A8%A1%E5%9D%97%E6%9B%9D%E5%85%89%E4%BA%8B%E4%BB%B6)
  - [IntersectionObserver API](#intersectionobserver-api)
    - [API](#api)
    - [callback 参数](#callback-%E5%8F%82%E6%95%B0)
    - [IntersectionObserverEntry 对象](#intersectionobserverentry-%E5%AF%B9%E8%B1%A1)
    - [Option 对象](#option-%E5%AF%B9%E8%B1%A1)
  - [代码示例](#%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B)


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

## 代码示例
```Javascript
this.autoTrackExpose = function () {
    if (!_this.getEnableExpose()) {
        util.log('未开启元素曝光');
    }
    common.bindEvent(window, 'scroll,click,resize', common.throttling(handleExposeSignal, EXPOSE_THROTTLE_TIME));
    handleExposeSignal();

    function handleExposeSignal () {
        var exposeNode = document.querySelectorAll('['+ EXPOSE_ATTR_FLAG +']');
        var viewportRect = common.getViewport();
        console.log(11);

        exposeNode.forEach(function (node) {
            var preStatus = node.isExposed;

            // 更新 isExposed
            node.isExposed = common.intersectRect(node.getBoundingClientRect(), viewportRect);
            node.nodeInfo = common.getTargetInfo(node);
            // 节点 destroy时需要 取消曝光心跳
            preStatus ? node.isExposed ? null :  exitExposeStatus(node) : node.isExposed ? inExposeStatus(node) : null;
        });

        function updateNodeHbTime (node) {
            node.mHbTime = new Date().getTime();
        }

        function inExposeStatus (node) {
            // 发送曝光事件
            _this.trackExpose(node.nodeInfo);
            updateNodeHbTime(node);
            // 曝光心跳
            var exposeHbObj = util.merge(node.nodeInfo);
            exposeHbObj.expTime = EXPOSE_HB_TIME;
            node.mTimeId = setInterval(function () {
                _this.trackExposeHb(exposeHbObj);
                // 更新 节点曝光时间
                updateNodeHbTime(node);
            }, EXPOSE_HB_TIME * 1000);
        }

        function exitExposeStatus (node) {
            var exposeHbObj = util.merge(node.nodeInfo);
            exposeHbObj.expTime = Math.ceil((new Date().getTime() - node.mHbTime) / 1000);
            clearInterval(node.mTimeId);
            _this.trackExposeHb(exposeHbObj);
        }
    }
};
```

##