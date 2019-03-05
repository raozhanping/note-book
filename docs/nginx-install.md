## Nginx原理、安装预配置

**1. Nginx的模块与工作原理**
  Nginx由内核和模块组成。内核十分简洁,因此完成的工作相对简单.内核的主要工作就是通过查找配置文件将客户端请求映射到一个location block(location是Nginx配置中的一个指令,用于URI/URL匹配)，而在这个location中所配置的每个指令将会启动不同的模块去完成相应的工作.  
**1.1 Nginx的模块结构**
- **核心模块:包括：http模块,event模块和mail模块**
- 基础模块:包括HTTP Access 模块、HTTP FastCGI 模块、HTTP Proxy模块和 HTTP Rewrite 模块  
- 第三方模:包括HTTP Upstream Request Hash 模块、Notice 模块 以及HTTP Access Key 模块属于第三方模块,用户根据自己的需要开发的模块都属于第三方模块。

**Nginx 的模块从功能上分为三类：**  
1. Handlers(处理器模块)  
此类模块直接处理请求,并进行输出内容和修改 headers信息等操作。handlers 处理器模块一般只能有一个。  

2. Filters (过滤器模块)  
此类模块主要对其他处理器模块输出的内容进行修改操作,最后由 Nginx 输出。  

3. Proxies (代理类模块)  
就是 Nginx 的 HTTP Upstream 之类的模块,这些模块主要与后端一些服务比如 fastcgi 等操作交互,实现服务代理和负载均衡等功能。  

下图展示了 Nginx 的模块处理一次常规的 HTTP 请求和响应的过程：  
![Ngix](https://upload-images.jianshu.io/upload_images/2814024-601c9f0b87254cf0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/643)  

**2. Nginx的模块与工作原理**