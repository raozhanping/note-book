# 前端JS实现字符串/图片/excel文件下载

传统的做法是在后端存储或者即时生成一个文件来提供下载功能，这样的优势是可以做权限控制、数据二次处理，但缺点是需要额外发起请求、增大服务端压力、下载速度慢。  

## 后端响应式下载

### Content-Disposition
  消息头指示回复的内容该以何种形式展示，是以 *内联* 的形式（即网页或者页面的一部分），还是以 **附件** 的形式下载并保存到本地。  

- inline  默认值，表示回复中的消息体会以页面的一部分或者整个页面的形式展示
- attachment  意味着消息体应该被下载到本地；大多数浏览器会呈现一个“保存为”的对话框，将filename的值预填为下载后的文件名

```
Content-Type: text/html; charset=utf-8

Content-Disposition: attachment; filename="cool.html"
```

但需要注意的是，如果想要用这种方式下载文件，不能使用AJAX的方式，而是应该新建一个<a>标签，模拟点击下载。原因为处于安全性考虑，JavaScript无法与磁盘进行交互，因此AJAX得到的内容将被保留在内存中，而不是磁盘上。  

### Nginx添加header头下载
和后端一样的原理，只不过头部信息通过Nginx统一添加。  

```
location ~ \.(jpg|jpeg|png|bmp|ico|gif|swf)$ {
    add_header Content-Disposition 'attachment; filename="cool.html"';
}
```

### 前端下载：<a>标签的download属性
> 此属性指示浏览器下载URL而不是导航到它，因此将提示用户将其保存为本地文件。如果属性有一个值，那么它将作为下载的文件名使用。此属性对允许的值没有限制，但是/和\会被转换为下划线。

1. 此属性仅适用于同源 URLs。
2. 尽管HTTP URL需要位于同一源中，但是可以使用 blob: URLs 和 data: URLs ，以方便用户下载 JavaScript 方式生成的内容（例如使用在线绘图的Web应用创建的照片）。

常规的<a>标签，用于链接的跳转，如新的页面，那么如果我们给<a>标签加上download属性，就能很简单的让用户保存新的html页面。  

```html
<a download="PHP实现并发请求.html" href="https://segmentfault.com/a/1190000016343861">PHP实现并发请求</a>
```

#### 生成并下载字符串文件

##### Blob 数据
> Blob(Binary Large Object，二进制类型的大对象)，表示一个不可变的原始数据的类文件对象，我们上传文件时常用的File对象就继承于Blob，并进行了扩展用于支持用户系统上的文件。

Blob(blobParts[, options])
```javascript
// 创建一个json类型的Blob对象，支持传入同类型数据的一个数组

var debug = {hello: "world"};

var blob = new Blob([JSON.stringify(debug, null, 2)],

    {type : 'application/json'});

// 此时blob的值

// Blob(22) {size: 22, type: 'application/json'}
```


