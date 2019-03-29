* [返回 《DATATIST数据采集接口文档V2.0.0》](https://gitlab.datatist.cn/ruby/datatist-product/blob/master/ji-zhu-wen-dang/datatistshu-ju-cai-ji-jie-kou-wen-dang.md)

## 业务采集接口

* [pageview采集](#pageview采集)
* [用户登出](#用户登出)
* [页面开始](#页面开始)
* [页面结束](#页面结束)
* [搜索采集](#搜索采集)
* [用户注册](#用户注册)
* [产品页访问](#产品页访问)
* [加入购物车](#加入购物车)
* [生成订单](#生成订单)
* [删除订单接口](#删除订单接口)
* [删除订单接口](#删除订单接口)
* [支付订单](#支付订单)
* [预充值](#预充值)
* [登录](#登录)
* [自定义事件](#自定义事件)
* [极光推送事件追踪](#极光推送事件追踪)
* [极光推送接收事件](#极光推送接收事件)
* [应用下载渠道](#应用下载渠道)


### pageview采集

  - 接口声明：trackPageview\(udVariable : object,callback: function\|option\)
  - 返回值：void
  - 调用示例（js方式）：
  ```
    trackPageview();
  ```
  - 参数说明：
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行存储；


### 用户登出

  - 接口声明：trackLogout \(udVariable : object,callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行存储；
  - 业务逻辑：
    > 发送登出请求，并且清空session中的userId。注：发送登出请求时，用户还未登出，session中含有userId，发送登出请求后，用户状态才可以变成登出状态。


### 页面开始

```diff
-（仅APP开发）
```

 - 接口声明：trackPageStart \(title: string, path: string,udVariable : object,callback: function\|option\)
 - 返回值：void
 - 参数说明：
   - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行存储；
   - title: 页面标题
   - path: 页面路径


### 页面结束

```diff
-（仅APP开发）
```

  - 接口声明：trackPageEnd \(title: string, path: string, udVariable : object,callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行存储；
    - title:页面标题
    - path:页面路径



### 搜索采集：

  - 接口声明：trackSearch \(keyword: string, recommendationSearchFlag: boolean, historySearchFlag: boolean, udVariable : object, callback: function\|option\)
  - 返回值：void
  - 调用示例（js方式）：
  - trackSearch\( '火龙果'\);
  - 参数说明：
    - keyword：搜索关键词；
    - recommendationSearchFlag：使用推荐搜索关键词的标志，值为true/false；
    - historySearchFlag：使用搜索历史记录来进行搜索，值为true/false；
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行存储；

    > 对应的1．0接口：piwik自动识别了H5的搜索，不用封装
    1.0中去掉e\_n,e\_c,e\_a,增加search字段，传入keyword





### 用户注册

  - 接口声明：trackRegister \(userId: string, type: string, authenticated: boolean, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - userId: 用户注册的用户ID；
    - type: 用户类型；
    - authenticated: 是否已认证的标识，值为true/false；
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行存储，将极光初始化对象中解析出的全局变量registrationID加在eventbody中传输

    > 对应的1．0接口：2.0中接口参数用json传，参数名为key
      \_paq.push\(\['trackEvent', 'event1.0','register',json\]\);



### 产品页访问

  - 接口声明：trackProductPage \(sku: string, productCategory1: String, productCategory2: String, productCategory3: String, productOriginalPrice: double, productRealPrice: double , udVariable: object , callback:   - function\|option\)
  - 返回值：void
  - 参数说明：
    - sku: 页面产品的SKU信息；
    - productCategory1: 一级目录；
    - productCategory2: 二级目录，没有值就留空；
    - productCategory3: 三级目录，没有值就留空；
    - productOriginalPrice: 商品原价
    - productRealPrice: 商品优惠价
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输；

    > 对应的1．0接口：2.0中接口参数用json传，参数名为key
    \_paq.push\(\['trackEvent', 'event1.0','productPage',json\]\);



### 加入购物车

  - 接口声明：trackAddCart \(sku: string, productQuantity: bigint, productRealPrice: double , udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - sku: 被加入购物车的SKU商品信息；
    - productQuantity: 被加入购物车的SKU商品数量；
    - productRealPrice: 被加入购物车的商品单价
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输；

  > 对应的1．0接口：2.0中接口参数用json传，参数名为key
    \_paq.push\(\['trackEvent', 'event1.0',' addCart ',json\);



### 生成订单

  - 接口声明：trackOrder \(orderInfo: object, couponInfo: object, productInfo: object, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - orderInfo: 订单信息，是一个Json类型的对象，其中包含项8项具体的参数：
      -    orderID string: 订单号
      -    orderAMT double: 订单总价（含运费）
    - shipAMT double: 运费总价
      -    shipAddress string: 收货地址
      -    shipMethod string: 配送方式
    - couponInfo: 优惠券信息，是一个JSON数组，其中包含2项具体的参数：
      -    couponType string: 优惠券类型
      -    couponAMT double: 优惠券金额
    - productInfo: 产品信息，是一个JSON数组，其中包含6项具体的参数：
      -    productSKU string: 产品SKU
      -    productTitle string: 产品名称
      -    productRealPrice double: 产品实际成交价
      -    productOriPrice double: 产品原价，值默认为-1
      -    productQuantity long: 产品数量
      -    productSourceSku string: 活动商品来源（例如赠品产品。传原商品sku，标识原商品的绑定关系）
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输。


    > 对应的1．0接口：2.0中接口参数用json传
    ```
    \_paq.push\(\['trackEvent', 'event1.0','order',json\]\);

    // productInfo. productSourceSku为空则不拼接，不为空则拼接
    for遍历productInfo {
        \_paq.push\(\['addEcommerceItem', productInfo.productSKU+'\_'+ productInfo. productSourceSku , productInfo.productTitle , "无", productInfo.productRealPrice , productInfoproductQuantity\]\);
    }

    var discount；
    for遍历couponInfo.couponType {
        discount += couponInfo.couponAMT;
    }
    \_paq.push\(\['trackEcommerceOrder', orderInfo.orderID , orderInfo.orderAMT , orderInfo.orderAMT-orderInfo.shipAMT , false, orderInfo.shipAMT, discount\]\);
    ```

### 删除订单接口

  - 接口声明：trackDeleteOrder \(orderID: string, orderAMT: double, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - orderID: 订单号
    - orderAMT: 订单总价（含运费）
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

    > 对应的1．0接口：2.0中接口参数用json传，参数名为key
    ```
    web:\_paq.push\(\[' trackDeleteOrder ', 'event1.0',' deleteOrder',json\]\);
    android: TrackHelper.track\(\).event\("event1.0", " deleteOrder"\)
       .name\(mjson\)
            .with\(tracker\);
    ios: \[\[DatatistTracker sharedInstance\] sendEventWithCategory:@"event1.0 " action:@" deleteOrder " name:@"mjson " value:@0 withCustomVariable:nil\];
    ```

### 支付订单

  - 接口声明：trackPayment \(orderID: string, payMethod: string, payStatus: boolean, payAMT: double, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - orderID: 订单号
    - payMethod: 支付渠道
    - payStatus: 支付状态，值为true/false
    - payAMT: 支付总金额
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

  > 对应的1．0接口：2.0中接口参数用json传，参数名为key
  ```
  ### \_paq.push\(\['trackEvent', 'event1.0',' payment ',json\]\);
  ```



### 预充值

  - 接口声明：trackPreCharge \(chargeAMT: double, chargeMethod: string, couponAMT: double, payStatus: boolean, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - chargeAMT: 充值金额
    - chargeMethod: 充值渠道
    - couponAMT: 充值优惠金额
    - payStatus: 支付状态，值为true/false
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

  > 对应的1．0接口：2.0中接口参数用json传，参数名为key
  ```
  \_paq.push\(\['trackEvent', 'event1.0','preCharge',json\]\);
  ```


### 登录

  - 接口声明：trackLogin \(userId: string, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - userId: 用户ID
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输，将极光初始化对象中解析出的全局变量registrationID加在eventbody中传输

  > 对应的1．0接口：2.0中接口参数用json传，参数名为key
  ```
  \_paq.push\(\['trackEvent', 'event1.0','login', json\]\);
  ```



### 设置用户ID
  - 接口声明：setUserId \(userId: string, callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - userId: 用户ID

  > 对应的1．0接口：直接获取2.0的userId

### 自定义事件

  - 接口声明：trackEvent \(eventName: string, udVariable: object , callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - eventName: 事件名称
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

  > 对应的1．0接口：2.0中接口参数用json传，参数名为key
  ```
  \_paq.push\(\['trackEvent', 'event1.0','event',json\];
  ```



### 极光初始化接口

> 目前只做极光推送。友盟，个推后期另外单独开发接口）

  - 接口声明：trackInitJPush\(pushManager:object ,udVariable: object\)
  - 返回值：void
  - 参数说明：
    - pushManager: 获得极光初始化的对象，从中间解析出registrationID、alias并将registrationID按照全局变量保存。并将registrationID发送一次，目的在于获取deviceID和registrationID的对应关系。
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

  > 1.0不传此接口


### 极光推送事件追踪

  > 目前只做极光推送。友盟，个推后期另外单独开发接口
  - 接口声明：trackJPush\(pushInfo:object,pushIntent:object ,udVariable: object\)
  - 返回值：void
  - 参数说明：
    - dcid和dtg没拿到值，设置为0，并且不重设session；dcid和dtg大于0，则2.0：new\_visit设为1，重设session；trackjpush中intent没有时，pushContent传""

  > 1.0：不发此接口，只做utm\_campaign和pushContent设置，在下一个pageview发送参数。伪代码如下：

```
设置全局变量 utm\_campaign = "trackJPush"pushContent=推送内容
……

当第一个pageview调用时，pageview中加判断
if\(utm\_campaign !=null\){
new\_visit=1；此次pageview消息带上new\_visit
pageview.url拼接上?utm\_campaign= trackJPush & pushContent=推送内容；
发出消息后 utm\_campaign=null；
}

……

2.0：下一个pageview的URL与1.0同步
```


```
pushInfo：记录推送的tag, registrationID,alias。三个参数至少一个有值。以JSON对象的形式进行传输，其中包含3项具体的参数：

    tag:string 设备标签

    registrationID：string 推送初始化成功时返回的registrationID

    alias:string 设备别名

pushIntent：Android为Intent对象，ios为json对象 。里面含有推送内容,dcid,dtg等必要参数

udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输
```


### 极光推送接收事件

  >（目前只做极光推送。友盟，个推后期另外单独开发接口）（ios不用）

  - 接口声明：trackReceiveJPush\(pushInfo:object,pushIntent:object ,udVariable: object\)
  - 返回值：void
  - 参数说明： trackReceiveJPush中intent没有时，pushContent传""
    - pushInfo：记录推送的tag, registrationID,alias。三个参数至少一个有值。以JSON对象的形式进行传输，其中包含3项具体的参数：
      -     tag:string 设备标签
      -     registrationID：string 推送初始化成功时返回的registrationID
      -     alias:string 设备别名
  - pushIntent：Android为Intent对象，ios为json对象 。里面含有推送内容,dcid,dtg等必要参数
  - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输





### 应用下载渠道

```diff
-（ios不用）
```

  - 接口声明：trackDownloadChannel \(downloadChannelName:string, udVariable: object\)
  - 返回值：void
  - 参数说明：
    - downloadChannelName:下载渠道应用市场名称（发布不同渠道打包时，会填写）
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

  > 1.0传入cvar，index为3：trackDownloadChannel，key：downloadChannelName  value："xxxx"
   下载渠道downloadChannelName改在customervar中传输，每个接口都带上

### 打开来源渠道
  - 接口声明：trackOpenChannel \(openChannelName:string, udVariable: object\)
  - 返回值：void
  - 参数说明：从第三方应用打开APP时调用
    - openChannelName:打开来源渠道名称
    - udVariable: 客户可扩展的自定义变量，以JSON对象的形式进行传输

  > 1.0：不发此接口，只做utm\_campaign设置，在下一个pageview发送参数。伪代码如下：

设置全局变量 utm\_campaign = openChannelName.value

……

当第一个pageview调用时pageview中加判断

```
if\(utm\_campaign !=null\){

new\_visit=1；此次pageview消息带上new\_visit

pageview.url拼接上?utm\_campaign= trackJPush & pushContent=推送内容；

发出消息后 utm\_campaign=null；

}

……

2.0：重设session，参数放在eventbody中。下一个pageview的URL与1.0同步

```


