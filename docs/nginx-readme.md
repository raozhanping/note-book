# Nginx简介
- [Nginx简介及使用Nginx实现负载均衡的原理](#Nginx简介及使用Nginx实现负载均衡的原理)
  - [1-环境](#1-环境)
  - [2-针对不同请求的负载均衡](#2-针对不同请求-的负载均衡)
  - [3-访问同一页面的负载均衡](#3-访问同一页面-的负载均衡)
  - [两种均衡](#两种均衡)
- [学习笔记](#学习笔记)
  - [简介](#简介)
  - [架构](#架构)
  - [基础概念](#基础概念)
  - [配置](#配置)

> nginx 这个轻量级、高性能的 web server 主要可以干两件事：
> 1. 直接作为http server(代替apache，对PHP需要FastCGI处理器支持)；
> 2. 另外一个功能就是作为反向代理服务器实现负载均衡；

### Nginx简介及使用Nginx实现负载均衡的原理
#### 1) 环境
1. 我们本地是Windows系统，然后使用VirutalBox安装一个虚拟的Linux系统。
　　在本地的Windows系统上分别安装nginx(侦听8080端口)和apache(侦听80端口)。在虚拟的Linux系统上安装apache(侦听80端口)。  
这样我们相当于拥有了1台nginx在前端作为反向代理服务器；后面有2台apache作为应用程序服务器(可以看作是小型的server cluster。;-) )；  
2. nginx用来作为反向代理服务器，放置到两台apache之前，作为用户访问的入口；
  nginx仅仅处理静态页面，动态的页面(php请求)统统都交付给后台的两台apache来处理。  
　也就是说，可以把我们网站的静态页面或者文件放置到nginx的目录下；动态的页面和数据库访问都保留到后台的apache服务器上。  
3. 如下介绍两种方法实现server cluster的负载均衡。
  我们假设前端nginx(为127.0.0.1:80)仅仅包含一个静态页面index.html；  
　后台的两个apache服务器(分别为localhost:80和158.37.70.143:80)，一台根目录放置phpMyAdmin文件夹和test.php(里面测试代码为print “server1“;)，另一台根目录仅仅放置一个test.php(里面测试代码为 print “server2“;)。  

#### 2) 针对不同请求 的负载均衡
1. 在最简单地构建反向代理的时候 (nginx仅仅处理静态不处理动态内容，动态内容交给后台的apache server来处理)，我们具体的设置为：在nginx.conf中修改:  
```
　　location ~ \.php$ {
　　proxy_pass 158.37.70.143:80 ;
　　}
```
  这样当客户端访问localhost:8080/index.html的时候，前端的nginx会自动进行响应；  
  当用户访问localhost:8080/test.php的时候(这个时候nginx目录下根本就没有该文件)，但是通过上面的设置 location ~ \.php$(表示正则表达式匹配以.php结尾的文件，详情参看location是如何定义和匹配的http://wiki.nginx.org/NginxHttpCoreModule) ，nginx服务器会自动pass给 158.37.70.143的apache服务器了。该服务器下的test.php就会被自动解析，然后将html的结果页面返回给nginx，然后 nginx进行显示(如果nginx使用memcached模块或者squid还可以支持缓存)，输出结果为打印server2。  
  如上是最为简单的使用nginx做为反向代理服务器的例子；  
2. 们现在对如上例子进行扩展，使其支持如上的两台服务器。我们设置nginx.conf的server模块部分，将对应部分修改为：  
```
　　location ^~ /phpMyAdmin/ {
　　proxy_pass 127.0.0.1:80 ;
　　}
　　location ~ \.php$ {
　　proxy_pass 158.37.70.143:80 ;
　　}
```
上面第一个部分location ^~ /phpMyAdmin/，表示不使用正则表达式匹配(^~)，而是直接匹配，也就是如果客户端访问的 URL是以http://localhost:8080/phpMyAdmin/ 开头的话(本地的nginx目录下根本没有phpMyAdmin目录)，nginx会自动pass到127.0.0.1:80 的Apache服务器，该服务器对phpMyAdmin目录下的页面进行解析，然后将结果发送给nginx，后者显示；  
如果客户端访问URL是http://localhost/test.php 的话，则会被pass到158.37.70.143:80 的apache进行处理。  

　　因此综上，我们实现了针对不同请求的负载均衡。  
　　〉如果用户访问静态页面index.html，最前端的nginx直接进行响应；
　　〉如果用户访问test.php页面的话，158.37.70.143:80 的Apache进行响应；
　　〉如果用户访问目录phpMyAdmin下的页面的话，127.0.0.1:80 的Apache进行响应；

#### 3) 访问同一页面 的负载均衡
即用户访问http://localhost:8080/test.php 这个同一页面的时候，我们实现两台服务器的负载均衡 (实际情况中，这两个服务器上的数据要求同步一致，这里我们分别定义了打印server1和server2是为了进行辨认区别)。
1. 现在我们的情况是在windows下nginx是localhost侦听8080端口；  
　　两台apache，一台是127.0.0.1:80(包含test.php页面但是打印server1)，另一台是虚拟机的158.37.70.143:80(包含test.php页面但是打印server2)。  
2. 因此重新配置nginx.conf为：
  首先在nginx的配置文件nginx.conf的http模块中添加，服务器集群server cluster(我们这里是两台)的定义：
复制代码 代码如下:  
```
upstream myCluster {
　　server 127.0.0.1:80 ;
　　server 158.37.70.143:80 ;
　　}
```
表示这个server cluster包含2台服务器，然后在server模块中定义，负载均衡：  
复制代码 代码如下:  
```
　　location ~ \.php$ {
　　proxy_pass http://myCluster ; #这里的名字和上面的cluster的名字相同
　　proxy_redirect off;
　　proxy_set_header Host $host;
　　proxy_set_header X-Real-IP $remote_addr;
　　proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
　　}
```
  这样的话，如果访问http://localhost:8080/test.php 页面的话，nginx目录下根本没有该文件，但是它会自动将pass到myCluster定义的服务区机群中，分别由127.0.0.1:80;或者158.37.70.143:80;来做处理。  
上面在定义upstream的时候每个server之后没有定义权重，表示两者均衡；如果希望某个更多响应的话例如：  
复制代码 代码如下:  
```
　　upstream myCluster {
　　server 127.0.0.1:80 weight=5;
　　server 158.37.70.143:80 ;
　　}
```
  这样表示5/6的几率访问第一个server,1/6访问第二个。另外还可以定义max_fails和fail_timeout等参数。  
**综上**，我们使用nginx的反向代理服务器reverse proxy server的功能，将其布置到多台apache server的前端。  
  nginx仅仅用来处理静态页面响应和动态请求的代理pass，后台的apache server作为app server来对前台pass过来的动态页面进行处理并返回给nginx。  
  通过以上的架构，我们可以实现nginx和多台apache构成的机群cluster的负载均衡。  

#### 两种均衡
1. 可以在nginx中定义访问不同的内容，代理到不同的后台server； 如上例子中的访问phpMyAdmin目录代理到第一台server上；访问test.php代理到第二台server上；  
2. 可以在nginx中定义访问同一页面，均衡 (当然如果服务器性能不同可以定义权重来均衡)地代理到不同的后台server上。 如上的例子访问test.php页面，会均衡地代理到server1或者server2上。  
  实际应用中，server1和server2上分别保留相同的app程序和数据，需要考虑两者的[数据同步](https://www.baidu.com/s?wd=%E6%95%B0%E6%8D%AE%E5%90%8C%E6%AD%A5&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1dhm1nsm1u9ujcdPHFhuWKB0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnWD1rj6LPHRsn1mLP1bsnW6vr0)

### 学习笔记
#### 简介
Nginx 是一款轻量级的 **Web （HTTP）服务器/反向代理服务器**及 **电子邮件（IMAP/POP3)** 代理服务器
*关键字*： 事件驱动  反向代理 负载平衡  响应静态页面的速度非常快
*优势*：能支持高达 50,000 个并发连接数  ；支持热部署  ；很高的稳定性（抵御dos攻击）

#### 架构
在 unix 系统中会以 daemon （守护进程）的方式在后台运行，后台进程包含 **一个 master 进程和多个 worker 进程（多进程的工作方式）** 
![nginx 架构](https://images2015.cnblogs.com/blog/1114336/201703/1114336-20170329151945358-1104561147.png)

1. 多个 worker 进程之间是对等的，他们同等竞争来自客户端的请求，各进程互相之间是独立的。
2. 一个请求，只可能在一个 worker 进程中处理，一个 worker 进程，不可能处理其它进程的请求。
3. 推荐设置 worker 的个数为 cpu 的核数
4. 异步非阻塞 （非阻塞不会让出cpu导致切换浪费）

#### 基础概念
##### connection
>是对 tcp 连接的封装;  

Nginx 通过设置 worker_connectons 来设置每个worker进程支持的最大连接数;  

Nginx 能建立的最大连接数，应该是 *worker_connections * worker_processes* ;对于 HTTP 请求本地资源来说，能够支持的最大并发数量是 *worker_connections * worker_processes* ，而如果是 HTTP 作为反向代理来说，最大并发数量应该是 *worker_connections * worker_processes/2* 。因为作为反向代理服务器，每个并发会建立与客户端的连接和与后端服务的连接，会占用两个连接;

##### request
>Nginx 中指 http 请求;

web服务器工作流：http 请求是典型的请求-响应类型的的网络协议，而 http 是文本协议，所以我们在分析请求行与请求头，以及输出响应行与响应头，往往是一行一行的进行处理。如果我们自己来写一个 http 服务器，通常在一个连接建立好后，客户端会发送请求过来。然后我们读取一行数据，分析出请求行中包含的 method、uri、http_version 信息。然后再一行一行处理请求头，并根据请求 method 与请求头的信息来决定是否有请求体以及请求体的长度，然后再去读取请求体。得到请求后，我们处理请求产生需要输出的数据，然后再生成响应行，响应头以及响应体。在将响应发送给客户端之后，一个完整的请求就处理完了。  

##### keepalive

长连接:  
http 请求是基于 TCP 协议之上的，那么，当客户端在发起请求前，需要先与服务端建立 TCP 连接(三次握手)，当连接断开后（四次挥手）。而 http 请求是请求应答式的，如果我们 **能知道每个请求头与响应体的长度** ，那么我们是 **可以在一个连接上面执行多个请求的，这就是所谓的长连接** ，但前提条件是我们先得确定请求头与响应体的长度。对于请求来说，如果当前请求需要有body，如 POST 请求，那么 Nginx 就需要客户端在请求头中指定 content-length 来表明 body 的大小，否则返回 400 错误。也就是说，请求体的长度是确定的，那么响应体的长度呢？
先来看看 http 协议中关于响应 body 长度的确定：  
1. 对于 `http1.0` 协议来说，如果响应头中有 content-length 头，则以 content-length 的长度就可以知道 body 的长度了，客户端在接收 body 时，就可以依照这个长度来接收数据，接收完后，就表示这个请求完成了。而如果没有 content-length 头，则客户端会一直接收数据，直到服务端主动断开连接，才表示 body 接收完了。

2. 而对于 `http1.1` 协议来说，如果响应头中的 *Transfer-encoding 为 chunked 传输* ，则表示 body 是流式输出，body 会被分成多个块，每块的开始会标识出当前块的长度，此时，body 不需要通过长度来指定。如果是非 chunked 传输，而且有 content-length，则按照 content-length 来接收数据。否则，如果是非 chunked，并且没有 content-length，则客户端接收数据，直到服务端主动断开连接。

从上面，我们可以看到，除了 http1.0 不带 content-length 以及 http1.1 非 chunked 不带 content-length 外，body 的长度是可知的。此时，当服务端在输出完 body 之后，会可以考虑使用长连接。能否使用长连接，也是有条件限制的。如果客户端的请求头中的 connection为close，则表示客户端需要关掉长连接，如果为 keep-alive，则客户端需要打开长连接，如果客户端的请求中没有 connection 这个头，那么根据协议，如果是 http1.0，则默认为 close，如果是 http1.1，则默认为 keep-alive。如果结果为 keepalive，那么，Nginx 在输出完响应体后，会设置当前连接的 keepalive 属性，然后等待客户端下一次请求。当然，Nginx 不可能一直等待下去，如果客户端一直不发数据过来，岂不是一直占用这个连接？所以当 Nginx 设置了 keepalive 等待下一次的请求时，同时也会设置一个最大等待时间，这个时间是通过选项 keepalive_timeout 来配置的，如果配置为 0，则表示关掉 keepalive，此时，http 版本无论是 1.1 还是 1.0，客户端的 connection 不管是 close 还是 keepalive，都会强制为 close。  

如果服务端最后的决定是 keepalive 打开，那么在响应的 http 头里面，也会包含有 connection 头域，其值是"Keep-Alive"，否则就是"Close"。如果 connection 值为 close，那么在 Nginx 响应完数据后，会主动关掉连接。所以，对于请求量比较大的 Nginx 来说，关掉 keepalive 最后会产生比较多的 time-wait 状态的 socket。一般来说，当客户端的一次访问，需要多次访问同一个 server 时，打开 keepalive 的优势非常大，比如图片服务器，通常一个网页会包含很多个图片。打开 keepalive 也会大量减少 time-wait 的数量。  
##### pipe
http1.1 引入新特性,keepalive 的一种升华，基于长连接的，目的就是利用一个连接做多次请求;

对 pipeline 来说，客户端不必等到第一个请求处理完后，就可以马上发起第二个请求;

##### linger_close
延迟关闭，也就是说，当 Nginx 要关闭连接时，并非立即关闭连接，而是先关闭 tcp 连接的写，再等待一段时间后再关掉连接的读。

#### 配置