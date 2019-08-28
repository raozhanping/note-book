## Service Worker

native app 可以做到离线使用、消息推送、后台自动更新，service worker 的出现正是为了使得 web app 也可以具有类似的能力。

Service Worker 可以：  

- 后台消息传递
- 网络代理，转发请求，伪造响应
- 离线缓存
- 消息推送
- ...

### 生命周期

一个 service worker 要经历以下历程：  

1. 安装  

2. 激活，激活成功之后，打开chrome://inspect/#service-workers 可以查看当前运行的 service worker

3. 监听 fetch 和 message 事件，下面两种事件会进行简要描述

4. 销毁，是否销毁有浏览器决定，如果一个 service worker 长期不使用或者机器内存有限，则可能会销毁 worker

### fetch 事件

在页面发起 http 请求时， service worker 可以通过 fetch 事件拦截请求，并且给出自己的响应。  

W3C提供了一个新的 fetch api，用于取代 XMLHttpRequest ，与XMLHttpRequest 最大的不同有两点：  

1. fetch() 方法返回的是 Promise 对象，通过then 方法进行连续调用，减少嵌套。 ES6 的 Promise 在成为标准之后，会越来越方便开发人员。  

2. 提供了 Request、Response 对象，如果做过后端开发，对 Request 、Response 应该比较熟悉。前端要发起请求可以通过 url 发起，也可以使用 Request 对象发起，而且 Request 可以复用。但是 Response 用在哪里呢？在service worker 出现之前，前端确实不会自己给自己发消息，但是有了 service worker，就可以在拦截请求之后根据需要返回自己的响应，对页面而言，这个普通的请求结果并没有区别，这是 Response 的一处应用。  

```
/* 由于是get请求，直接把参数作为query string传递了 */
var URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=your_api_key&format=json&nojsoncallback=1&tags=penguins';
 
function fetchDemo() {
  // fetch(url, option)支持两个参数，option中可以设置header、body、method信息
  fetch(URL).then(function(response) {
    // 通过promise 对象获得相应内容，并且将响应内容按照json格式转成对象，json()方法调用之后返回的依然是promise对象
    // 也可以把内容转化成arraybuffer、blob对象
    return response.json();
  }).then(function(json) {
    // 渲染页面
    insertPhotos(json);
  });
}
 
fetchDemo();
```

fetch api 与 XMLHttpRequest 相比，更加简洁，并且提供的功能更全面，资源获取方式比ajax更优雅。兼容性方面：chrome 42开始支持，对于旧浏览器，可以通过官方维护的polyfill支持。  

### message 事件

页面和 service worker 之间可以通过posetMessage() 方法发送消息，发送的消息可以通过 message事件接收到。  

这是一个双向的过程，页面可以发消息给service worker，service worker也可以发送消息给页面，由于这个特性，可以将service worker作为中间纽带，使得一个域名或者子域名下的多个页面可以自由通信。  

这里是一个小的页面之间通信[demo](https://nzv3tos3n.qnssl.com/message/msg-demo.html)  

### 问题1. 运行时间

service worker并不是一直在后台运行的。在页面关闭后，浏览器可以继续保持service worker运行，也可以关闭service worker，这取决与浏览器自己的行为。所以不要定义一些全局变量，  

```
var hitCounter = 0;
 
this.addEventListener('fetch', function(event) {
  hitCounter++;
  event.respondWith(
    new Response('Hit number ' + hitCounter)
  );
});
```
返回的结果可能是没有规律的：1,2,1,2,1,1,2….，原因是hitCounter并没有一直存在，如果浏览器关闭了它，下次启动的时候hitCounter就赋值为0了  

这样的事情导致调试代码困难，当你更新一个service worker以后，只有在打开新页面以后才可能使用新的service worker，在调试过程中经常等上一两分钟才会使用新的，比较抓狂。  

### 问题2. 权限太大

当service worker监听fetch事件以后，对应的请求都会经过service worker。通过chrome的network工具，可以看到此类请求会标注：from service worker。如果service worker中出现了问题，会导致所有请求失败，包括普通的html文件。所以service worker的代码质量、容错性一定要很好才能保证web app正常运行。  