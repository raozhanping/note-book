## Http 协议

### 基础概念篇

#### 介绍
  
  HTTP是Hyper Text Transfer Protocol(超文本传输协议)的缩写。它的发展是万维网协会（World Wide Web Consortinum）和Internet工作小组IETF（Internet Engineering Task Force）合作的结果，他们最终发布了一些列RFC，RFC 1945定义了HTTP/1.0版本。其中最著名的是 RFC2616。 **RFC 2616** 定义了今天普遍使用的一个版本—— **HTTP 1.1**。   

  HTTP协议（HyperText Transfer Protocol，超文本传输协议）是用于从WWW服务器传输超文本到本地浏览器的传送协议。他可以使浏览器更加高效，使网络传输减少，还确定传输文档中的哪一部分，以及哪部分内容首先显示（如文本先于图形）等。  

#### 在 TCP/IP 协议栈中的位置

  HTTP协议通常承载于 **TCP** 协议之上，有时也承载于 **`TLS`** 或 *SSL* 协议层之上，这个时候就是我们常说的HTTPS。  
  如下图所示：  
  <img src="http://www.blogjava.net/images/blogjava_net/amigoxie/40799/o_http%e5%8d%8f%e8%ae%ae%e5%ad%a6%e4%b9%a0-11.jpg" alt="http在TCP/IP协议栈中位置">

#### HTTP 的请求响应模型

  这样限制了 **HTTP** 协议，无法实现在客户端没有发起请求的时候，服务器将消息推送给客户端。  

  HTTP协议是一个无状态的协议，同一个客户端的这次请求和上次请求是没有对应关系的。  

#### 工作流程

  一次 HTTP 操作称为一个事务。 

#### 使用 Wireshark 抓 TCP、 http 包

#### 头域
> 每个头域有一个域名、冒号（:）和域值三部分组成。域名是大小写无关的，域值前可以坚决爱任何数量的空格符，头域可以被拓展为多行，在每行开始处，使用至少一个空格或制表符。

1. **Host 头域**  

  Host 头域`指定请求资源的Internet主机和端口号`，必须表示请求url的原始服务器或网关的位置。 HTTP/1.1 请求必须包含主机头域，否则系统会以400状态码返回。  

2. **Referer 头域**  

  Referer 头域`允许客户端指定请求 uri 的资源源地址`，这可以允许服务器生成回退链表，可用来登录、优化cache等。他也允许废除的或错误的连接由于维护的目的被追踪。如果请求的uri没有自己的uri地址，Referer 不能被发送。如果指定的是部分 uri 地址，则此地址应该是一个相对地址。  

3. **User-Agent 头域**  

  User-Agent 头域的内容`包含发出请求的用户信息`。  

4. **Cache-Control 头域**  

  Cache-COntrol指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程。请求时的缓存指令包括：  
  `no-cache、 no-store、 max-age、 max-stale、 min-fresh、 only-if-cached`
    
  响应消息中的指令包括：  
  `public、 private、 no-cache、 no-store、 no-transform、 must-revalidate、 proxy-revalidate、 max-age`

5. **Date 头域**  

  Date头域表示`消息发送的时间`，时间描述格式由 RFC822 定义。  

6. **HTTP 的几个重要概念**

  - **连接： Connection**  

    一个传输层的实际环流，他是建立在两个相互通讯的应用程序之间。  

    在 http1.1、 request、和response头中都有可能出现一个 connection 的头，此 header 的含义是当 client 和 server 通信时 *对于长链接如何进行处理* 。  

    在 http1.1 中， client 和 server 都是默认对方支持长连接的，如果 client 使用 http1.1 协议，但又不希望使用长连接，则需要在 header 中指明 connection的值为close；如果 server 方也不想支持长连接，则在response中也需要明确说明 connection 的值为 close。不论 request 还是 response 的 header 中包含了值为 close 的 connection，都表明当前正在使用的 tcp 链接在当天请求处理完毕后会被断掉。以后 client 再进行新的请求时就必须创建新的tcp链接了。  

  2. **消息： Message**  

    HTTP 通讯的基本单位，包括一个结构化的八元组序列病通过连接接传输。  

  3. **请求： Request**  

    一个从客户端到服务器的请求信息包括应用于资源的方法、资源的标识符、资源的标识符和协议的版本号。  

  4. **响应： Response**  

    一个从服务器返回的信息包括 HTTP 协议的版本号、请求的状态和文档的 MIME 类型。  

  5. **资源： Resource**  

    由 URI 标识的网络数据对象或服务。  

  7. **实体： Entity**  

    数据资源或来自服务资源的回应的一种特殊表示方法，他可能被包围在一个请求或响应信息中。一个实体包括实体头信息和实体的本身内容。

  8. **客户机： Client**  

    一个为发送请求目的而建立连接的应用程序。  

  9. **用户代理： UserAgent**  

    初始化一个请求的客户机。他们是浏览器、编辑器或其他用户工具。  

  10. **服务器： Server**  

    一个接收连接并对请求返回信息的应用程序。  

  11. **源服务器： Originserver**  

    是一个给定资源可以在其上驻留或被创建的服务器。  

  12. **代理： Proxy**  

    一个中间程序，他可以充当一个服务器，也可以充当一个客户机，为其他客户机建立请求。请求是通过可能的翻译在内部或经过传递到其他的服务器中。一个代理在发送请求信息之前，必须解释并且如果可能重写它。  

    代理经常作为通过防火墙的客户机端的门户，代理还可以作为一个帮助应用来通过协议处理没有被用户代理完成的请求。  

  13. **网关： Gateway**  

    一个作为其他服务器中间媒介的服务器。与代理不同的是，网关接受请求就好像对被请求的资源来说他就是源服务器；发出请求的客户机并没有意识到他在同网关打交道。  

    网关经常作为通过防火墙的服务器端的门户，网关还可以作为一个协议翻译器以便存取那些存储在非 HTTP 系统中的资源。  

  14. **通道： Tunnel**  

    是作为两个连接中继的中介程序。一旦激活，通道便认为不属于HTTP通讯，尽管通道可能是一个HTTP请求初始化的。当被中继的连接两端关闭时，通道便消失。当一个门户（Portal）必须存在或中介（Intermediary）不能解释中继的通讯时通道被经常使用。  

  15. **缓存： Cache**  

    反应信息的局域存储。  

