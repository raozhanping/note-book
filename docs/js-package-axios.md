#  axios 
> Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。

- [axios](#axios)
  - [Axios 功能](#axios-%E5%8A%9F%E8%83%BD)
  - [Axios request 核心代码](#axios-request-%E6%A0%B8%E5%BF%83%E4%BB%A3%E7%A0%81)
  - [reference](#reference)


## Axios 功能
- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF
  
## Axios request 核心代码
```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios.prototype.request = function request(config) {
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }
    // 合并配置
  config = mergeConfig(this.defaults, config);
    // 请求方式，没有默认为 get
  config.method = config.method ? config.method.toLowerCase() : 'get';
    
    // 重点 这个就是拦截器的中间件
  var chain = [dispatchRequest, undefined];
    // 生成一个 promise 对象
  var promise = Promise.resolve(config);

    // 将请求前方法置入 chain 数组的前面 一次置入两个 成功的，失败的
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
	// 将请求后的方法置入 chain 数组的后面 一次置入两个 成功的，失败的
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

   // 通过 shift 方法把第一个元素从其中删除，并返回第一个元素。
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```


## reference
- [Axios 源码解读](https://juejin.im/post/5cb5d9bde51d456e62545abc)



