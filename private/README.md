# function
- [function](#function)
  - [JS Array Unique](#js-array-unique)
  - [toastr 提示信息(throttling)](#toastr-%E6%8F%90%E7%A4%BA%E4%BF%A1%E6%81%AFthrottling)
  - [debounce](#debounce)
  - [throttling](#throttling)

## JS Array Unique
```Javascript
ArrayUtil.unique = function (arr){
    if(Array.isArray(arr)){
        var result=[],obj={},val,type;
        for(var i=0;i<arr.length;i++) {
            val = arr[i];
            type = typeof arr[i];
            if(!obj[val]){
                obj[val] = [type];
                result.push(val);
            }
            else if(obj[val].indexOf(type)==-1){
                obj[val].push(type);
                result.push(val);
            }
        }
        return result;
    } else {
        return false;
    }
};
```


## toastr 提示信息(throttling)
```Javascript
    /**
     * 每个入队的Obj 具有显示过渡期duringTime; 为其添加 自我销毁功能: 越过duringTime 自动出队
     */
    var ToastrInfo = function() {
        var EnqueueObj = function(message, config, duringTime, callback) {
            this.message = message;
            this.config = config;
            this.duringTime = duringTime || 0;
            this.timeId = null; // 自动销毁 程序的 timeId
            this.index = null; // 匹配到队列中目标的下标
            
            this.autoDestory = function(callback) {
                var self = this;
                this.timeId = setTimeout(function() {
                    self.actionFunc();
                    typeof callback === "function" && callback(self);
                }, this.duringTime);
            };
            this.actionFunc = function () {
                console.debug('---ToastrInfo', JSON.stringify(this, '', 4));
                toastr[this.message.level](this.message.content, this.message.title, this.config);
            };
            this.init = (function(that) {
                that.autoDestory(callback);
            })(this);
        };

        this.toastrInfoList = [];
        this.enqueue = function(message, config) {
            var toastrObj = new EnqueueObj(message, config, 1000, this.dequeue.bind(this));

            // FIXME: 存在阻塞风险未成功入队
            if (this.isMatchedInList(toastrObj) != null) {
                clearTimeout(toastrObj.timeId);
                toastrObj = null;
                return false;
            };
            this.toastrInfoList.push(toastrObj);
        };
        this.dequeue = function(toastrObj) {
            clearTimeout(toastrObj.timeId);
            this.toastrInfoList.splice(toastrObj.index, 1);
        };
        this.isMatchedInList = function (toastrObj) {
            this.toastrInfoList.forEach(function(infoVal, index) {
                // match condition
                if (infoVal.message.level === toastrObj.message.level && infoVal.message.title == toastrObj.message.title && infoVal.message.content == toastrObj.message.content) {
                    toastrObj.index = index;
                };
            });

            return toastrObj.index;
        };
    };
```


## debounce
> 防抖技术即是可以把多个顺序地调用合并成一次，也就是在一定时间内，规定事件被触发的次数。

```Javascript
// 防抖动函数
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
```


## throttling
> 节流函数，只允许一个函数在 X 毫秒内执行一次。

```Javascript
// 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
        startTime = new Date();
 
    return function() {
        var context = this,
            args = arguments,
            curTime = new Date();
 
        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
            func.apply(context,args);
            startTime = curTime;
        // 没达到触发间隔，重新设定定时器
        }else{
            timeout = setTimeout(func, wait);
        }
    };
};
```

