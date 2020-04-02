## WebSocket

> WebSocket 协议是基于TCP的一种新的网络协议。它实现了浏览器与服务器全双工（full-duplex）通信——允许服务其主动发送信息给客户端。

### 概述

The WebSocket Protocol enables two-way communication between a client running untrusted code in a controlled environment to a remote host that has opted-in to communications from that code. The security model used for this is the origin-based security model commonly used by web browsers. The protocol consists of an opening handshake followed by basic message framing, layered over TCP. The goal of this technology is to provide a mechanism for browser-based applications that need two-way communication with servers that does not rely on opening multiple HTTP connections (e.g., using XMLHttpRequest or &lt;iframe&gt;s and long polling).  

WebSocket 协议支持（在受控环境中公运行不受信任的代码的）**客户端**与（选者加入该代码的通信的）**远程主机**之间进行**全双工通信**。用于此的安全模型是Web浏览器常用的基于原始的安全模式。协议包括一个开放的握手以及随后的**TCP**层上的消息帧。该技术的目标是为基于浏览器的、需要和服务器进行双向通信的（服务器不能依赖于打开多个HTTP链接（例如，使用 XMLHttpRequest 或&lt;iframe&gt;和长轮询））应用程序提供一种通信机制。  

### 产生背景

简单的说，WebSocket协议之前，双工通信是通过多个http链接来实现的，这导致了效率低下。WebSocket解决了这个问题。  

下面是标准RFC6455中的产生背景概述。  

长久以来，创建实现客户端和用户端之间双工通讯的web app 都会造成HTTP轮询的滥用：客户端向主机不断发送不同的HTTP呼叫来进行询问。  

这会导致一系列问题：  

1. 服务器被迫为每个客户端使用许多不同的底层TCP连接：一个用于向客户端发送信息，其它用于接收每个传入消息。
2. 有线协议有很高的开销，每个客户端和服务器之间都有HTTP头。
3. 客户端脚本被迫维护从传出连接到传入连接的映射来追踪回复。

一个更简单的解决方案是使用单个TCP连接双向通信。这就是WebSocket协议所提供的功能。结合WebSocket API，WebSocket协议提供了一个用来替代HTTP轮询实现网页到远程主机的双向通信的方法。  

WebSocket协议被设计来取代用HTTP作为传输层的双向通讯技术，这些技术只能牺牲效率和可依赖性其中一方来提高另一方，因为HTTP最初的目的不是为了双向通讯。  

### 实现原理

在实现websocket连线过程中，需要通过浏览器发出websocket连线请求，然后服务器发出回应，这个过程通常称为‘握手’。在WebSocket API，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一个快速通道。两者之间就直接可以数据互相传送。在此WebSocket协议中，为我们实现及时服务带来了两大好处：

1. Header  
互相沟通的Header是很小的-大概只有2Bytes

2. Server Push  
服务器的推送，服务器不再被动的接收到浏览器的请求之后才返回数据，而是在有新数据时就主动推送给浏览器。

### 握手协议例子

**浏览器请求**

GET /webfin/websocket/ HTTP/1.1  

Host: localhost  
Upgrade: websocket  
Connection: Upgrade  
Sec-WebSocket-Key: xqBt3ImNzJbYqRINxEFlkg==  
Origin: http://服务器地址  
Sec-WebSocket-Version: 13  

**服务器回应**

HTTP/1.1 101 Switching Protocols  

Upgrade: websocket  
Connection: Upgrade  
Sec-WebSocket-Accept: K7DJLdLooIwIG/MOpvWFB3y3FE8=  

### HTML5 Web Socket API

在HTML5中内置有一些API，用于响应应用程序发起的请求。基本API语句如下：  
```
var ws = new WebSocket(url, name);
//url为WebSocket服务器的地址，name 为发起握手协议的名称，为可选择项
ws.send();

ws.onmessage = (function () {...})();

ws.onerror = (function () {...})();

ws.close();

```

### 浏览器以及语言支持

所有浏览器都支持RFC6455。但是具体的WebSocket版本有区别。  
php jetty netty ruby Kaazing nginx python Tomcat Django erlang
netty .net等语言均可以用来实现支持WebSocket的服务器。  

websocket api在浏览器端的广泛实现似乎只是一个时间问题了, 值得注意的是服务器端没有标准的api, 各个实现都有自己的一套api, 并且tcp也没有类似的提案, 所以使用websocket开发服务器端有一定的风险.可能会被锁定在某个平台上或者将来被迫升级。


