## HTML

### iframe
#### 1. iframe 常用属性

1. frameborder:是否显示边框，1(yes),0(no)
2. height:框架作为一个普通元素的高度，建议在使用css设置。
3. width:框架作为一个普通元素的宽度，建议使用css设置。
4. name:框架的名称，window.frames[name]时专用的属性。
5. scrolling:框架的是否滚动。yes,no,auto。
6. src：内框架的地址，可以使页面地址，也可以是图片的地址。
7. srcdoc , 用来替代原来HTML body里面的内容。但是IE不支持, 不过也没什么卵用
8. sandbox: 对iframe进行一些列限制，IE10+支持

#### 2. iframe 同域
##### 2.1 获取 iframe 里的内容
1. iframe.contentWindow, 获取iframe的window对象
2. iframe.contentDocument, 获取iframe的document对象

这两个API只是DOM节点提供的方式(即getELement系列对象)  
另外更简单的方式是，结合Name属性，通过window提供的frames获取  
```javascript
<iframe src ="/index.html" id="ifr1" name="ifr1" scrolling="yes">
  <p>Your browser does not support iframes.</p>
</iframe>

<script type="text/javascript">
    console.log(window.frames['ifr1'].window);
    console.dir(document.getElementById("ifr1").contentWindow);
</script>
```

##### 2.2 在 iframe 中获取父级内容
> 同理，在同域下，父页面可以获取子iframe的内容，那么子iframe同样也能操作父页面内容。

1. window.parent 获取上一级的window对象，如果还是iframe则是该iframe的window对象
2. window.top 获取最顶级容器的window对象，即，就是你打开页面的文档
3. window.self 返回自身window的引用。可以理解 window===window.self
![iframe中获取父级内容](https://segmentfault.com/img/remote/1460000004840623)

##### 2.3 iframe 的轮询
话说在很久很久以前，我们实现异步发送请求是使用iframe实现的~!
怎么可能!!!
真的史料为证(自行google), 那时候为了不跳转页面，提交表单时是使用iframe提交的。现在，前端发展尼玛真快，websocket,SSE,ajax等，逆天skill的出现，颠覆了iframe, 现在基本上只能活在IE8,9的浏览器内了。 但是，宝宝以为这样就可以不用了解iframe了,而现实就是这么残酷，我们目前还需要兼容IE8+。所以，iframe 实现长轮询和长连接的trick 我们还是需要涉猎滴。

##### 2.4 iframe 的长轮询
```javascript
var iframeCon = docuemnt.querySelector('#container'),
        text; //传递的信息
    var iframe = document.createElement('iframe'),
        iframe.id = "frame",
        iframe.style = "display:none;",
        iframe.name="polling",
        iframe.src="target.html";
    iframeCon.appendChild(iframe);
    iframe.onload= function(){
        var iloc = iframe.contentWindow.location,
            idoc  = iframe.contentDocument;
        setTimeout(function(){
            text = idoc.getElementsByTagName('body')[0].textContent;
            console.log(text);
            iloc.reload(); //刷新页面,再次获取信息，并且会触发onload函数
        },2000);
    }
```
这样就可以实现ajax的长轮询的效果。 当然，这里只是使用reload进行获取，你也可以添加iframe和删除iframe的方式，进行发送信息，这些都是根据具体场景应用的。另外在iframe中还可以实现异步加载js文件，不过，iframe和主页是共享连接池的，所以还是很蛋疼的，现在基本上都被XHR和hard calllback取缔了，这里也不过多介绍了。  

##### 2.5 自适应广告
##### 2.6 自适应 iframe
1. allowtransparency	true or false
    是否允许iframe设置为透明，默认为false
2. allowfullscreen	true or false
    是否允许iframe全屏，默认为false

##### 2.7 X-Frame-Options
X-Frame-Options是一个相应头，主要是描述服务器的网页资源的iframe权限。目前的支持度是IE8+(已经很好了啊喂)有3个选项:  
1. DENY：当前页面不能被嵌套iframe里，即便是在相同域名的页面中嵌套也不允许,也不允许网页中有嵌套iframe
2. SAMEORIGIN：iframe页面的地址只能为同源域名下的页面
3. ALLOW-FROM：可以在指定的origin url的iframe中加载

X-Frame-Options其实就是将前端js对iframe的把控交给服务器来进行处理。  
```javascript
//js
if(window != window.top){
    window.top.location.href = window.location.href;
}
//等价于
X-Frame-Options: DENY

//js
if (top.location.hostname != window.location.hostname) { 
　　　　top.location.href =window.location.href;
}
//等价于
X-Frame-Options: SAMEORIGIN
```
该属性是对页面的iframe进行一个主要限制，不过，涉及iframe的header可不止这一个，另外还有一个 **Content Security Policy**, 他同样也可以对iframe进行限制，而且，他应该是以后网页安全防护的主流。

##### 2.8 sandbox
1. allow-forms	允许进行提交表单
2. allow-scripts	运行执行脚本
3. allow-same-origin	允许同域请求,比如ajax,storage
4. allow-top-navigation	允许iframe能够主导window.top进行页面跳转
5. allow-popups	允许iframe中弹出新窗口,比如,window.open,target="_blank"
6. allow-pointer-lock	在iframe中可以锁定鼠标，主要和鼠标锁定有关

#### 3. resolve iframe跨域
> 浏览器判断你跨没跨域，主要根据两个点。 一个是你网页的协议(protocol)，一个就是你的host是否相同，即，就是url的首部

![href](https://segmentfault.com/img/remote/1460000004845225)

##### 3.1 H5的CDM跨域与iframe
如果你设置的iframe的域名和你top window的域名完全不同。 则可以使用 **CDM(cross document messaging)**进行跨域消息的传递。该API的兼容性较好 ie8+都支持.
发送消息: 使用 **postmessage**方法
接受消息: 监听message事件

##### 3.2 postmessage
该方法挂载到window对象上，即，使用 **window.postmessage()**调用.  
该方法接受两个参数:postMessage(message, targetOrigin):  
**message**: 就是传递给iframe的内容, 通常是string,如果你想传object对象也可以.(stringify)  
**targetOrigin**: 接受你传递消息的域名，可以设置绝对路径，也可以设置""或者"/"。 表示任意域名都行，"/"表示只能传递给同域域名。  
当targetOrigin接受到message消息之后,会触发message事件。 message提供的event对象上有3个重要的属性，data,origin,source.
1. data：postMessage传递进来的值
2. origin：发送消息的文档所在的域
3. source：发送消息文档的window对象的代理，如果是来自同一个域，则该对象就是window，可以使用其所有方法，如果是不同的域，则window只能调用postMessage()方法返回信息