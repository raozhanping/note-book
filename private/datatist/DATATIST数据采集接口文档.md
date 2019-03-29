# DATATIST数据采集接口文档 V2.0.0

```
文档版本: 2.0.0
文档分类：技术部-设计文档
作 者: 赵 鑫
联系电话：13701326552
电子邮件：xin.zhao@datatist.com
```

## 目录

* [联系人](#联系人)
* [变更记录](#变更记录)
* [1. 前言](#1-前言)
    * [1.1 内容简介](#11-内容简介)
    * [1.2. 读者范围](#12-读者范围)
* [2. Event事件格式详解](#2-Event事件格式详解)
    * [2.1. 事件定义规范](#21-事件定义规范)
    * [2.2 Event scheme定义](#22-Event-scheme定义)
* [3. 传输协议](#3-传输协议)
    * [3.1. 单条传输](#31-单条传输)
    * [3.2. 批量传输](#32-批量传输)
* [4. Tracker 采集器设计](#4-Tracker-采集器设计)
    * [4.1. 初始化和参数设置](#41-初始化和参数设置)
    * [4.2. Tracker 成员变量生命周期解释](#42-Tracker-成员变量生命周期解释)
    * [4.3. session描述](#43-session描述)
    * [4.4. 通用采集接口（单条）](#44-通用采集接口单条)
    * [4.5. 通用采集接口（多条）](#45-通用采集接口多条)
    * [4.6. 批量采集接口](#46-批量采集接口)
    * [4.7. Sdk Js打通](#47-Sdk-Js打通)
        * [4.7.1 背景](#471-背景)
        * [4.7.2 打通的方式](#472-打通的方式)
        * [4.7.3 接口定义](#473-接口定义)
    * [4.8. 业务采集接口](https://gitlab.datatist.cn/ruby/datatist-product/blob/master/ji-zhu-wen-dang/DATATIST数据采集接口文档-业务采集接口.md)
    * [4.9. 全埋点和trackClick接口](#49-全埋点和trackclick)


```diff
------------------------------------------------------------------------------------
2019-01-04
+ Event Scheme增加sessionInfo，详见2.2 Event scheme定义和4.3


------------------------------------------------------------------------------------
2018-11-13
+ Event Scheme增加三个字段，refererUrlTime appVersion downloadChannel


------------------------------------------------------------------------------------
2018-08-01
+ Event Scheme增加经纬度字段

2018-06-20
+ APP内嵌H5跨projectId解决方案 (4.7.4 接口实现方式伪代码) 注：只有IOS和Andriod需要改动
+ event Scheme定义增加bridgeInfo (详见2.2 Event scheme定义)
+ 事件定义(Event Scheme)增加字段projectId (详见2.2 Event scheme定义)


------------------------------------------------------------------------------------
2018-05-21
+ 自定义事件
4.10 增加自定义事件采集
+ 用户属性采集
2.2 Event Scheme增加userProperty字段


------------------------------------------------------------------------------------
2018-05-16
+ 全埋点
4.1. 初始化和参数设置 增加参数autoTrack
4.1. 初始化和参数设置 增加参数autoTrackSkipElements
4.1. 初始化和参数设置 增加参数autoTrackAttributes
4.9. 增加 全埋点和trackClick


------------------------------------------------------------------------------------
2018-4-25 新增内容
+ SDK Js打通
+ 传输中的数据压缩

TODO:
+ 埋码时加入项目Id，这样就不需要在后期通过join的方式获得projectId
+ autoLink：跨站实现session打通
+ session加密加密防攻击方案

```

### 联系人

|  | 联系人 | 邮箱 |
| :---: | :---: | :---: |
| 第一联系人 | 赵鑫 | xin.zhao@datatist.com |
| 第二联系人 | 祁云峰 | frankie@datatist.com |
| 第三联系人 | 左鹏飞 | darfy.zuo@datatist.com |


### 变更记录

- **2017年09月19日         赵鑫**
    - 初始化

* **2017年11月2日        吴浩勇**

    - 添加android部署    Android SDK使用

* **2017年11月7日           左鹏飞**

    - 删除android部署写在另外的文档里

    - 新增setUserID接口

    - 登录接口中自动setUserID

* **2017/11/20                  左鹏飞**

    - productInfo改为productSkk

    - 2.0接口中封装1.0对应方法

* **2017/12/12               左鹏飞**

    - APP sdk新增极光推送事件追踪接口

* **2018/1/3                   左鹏飞**

    - 新增极光推送初始化接口，修改登录，注册接口    新增接口

* **2018/1/4                   左鹏飞**

    - 登录，注册registionID改到eventbody中传输

* **2018/1/16                 左鹏飞**

    - x=y trackJpush增加说明

* **2018/1/29                 左鹏飞**

    - 极光初始化接口

    - 极光推送事件追踪

    - 应用下载渠道

    - 打开来源渠道

* **2018/3/6                   左鹏飞**

    - customerVar传当前APP版本号和sdk版本

* **2018/3/28                 左鹏飞**

    - 新增页面开始，页面结束，登出api


## 1. 前言

### 1.1 内容简介

datatist数据采集负责收集客户的Event事件数据，数据的来源可以是网站、客户端（IOS，Andriod）等终端设备。数据采集接口文档将描述数据在采集过程中的协议，接口的输入参数、输出参数以及接口的调用方式。

* Event (事件数据)

    Event事件 是数据采集设计中重要的概念，Event由用户的动作产生，如的登录动作会产生登录事件，购买动作会产生购买事件，用户每发生一个动作都可以产生一个事件

* Tracker (采集器)

    Tracker 是事件上报的载体


### 1.2. 读者范围

- [x] 客户端开发人员（JS、IOS、Andirod）
- [x] 数据工程师
- [x] 产品经理
- [x] 实施人员


## 2. Event事件格式详解

** Event事件 **  是数据采集设计中重要的概念，Event由用户的动作产生，如的登录动作会产生登录事件，购买动作会产生购买事件，用户每发生一个动作都可以产生一个事件，将事件数据上报到采集服务器，即完成数据采集。

### 2.1. 事件定义规范

* 事件属性命名规范
    * 小写英文字母或下划线开头
    * 驼峰命名
    * 以英文大小写字母和数字组成
* 属性逻辑值规范
    * 1或0，1代表真，0代表假
* 时间格式规范
    * unix时间戳，例：1483228800000
    * 8个字节的长整型型数字，单位精确到毫秒
  > 例：以格林尼治时区为例
  >
  > 0代表1970-01-01 00:00:0
  >
  > 1483228800000代表2017-01-01 00:00:00

### 2.2 Event scheme定义

| 参数名称 | 参数 | 默认传输方式 | 生命周期的级别 | 必传 | 类型 | 描述 |
| --- | --- | --- | --- | --- | --- | --- |
| 时间 | eventTime | http url | request | Y | 长整型 | 精确到毫秒的unix时间戳 |
| 客户端IP地址 | ip | http协议隐式传参 | request | Y | 字符串 |  |
| 会话id | sessionId | http header | session | Y | 字符串 | 固定16字符长度，客户端生成，每一个字符只能是0-f的16进制字符。最佳实践方式是采用md5算法。|
| session信息 | sessionInfo | http url | session | N | 字符串 | json格式的单层对象 |
| 会话开始时间 | seStartTime | http header | session | Y | 长整型 | 精确到毫秒的unix时间戳 |
| User agent | “User-Agent”, 传输后变为 userAgent | http header | device | N | 字符串 | 这个参数由于是浏览器参数，所以命名方式保持不变。 |
| 设备id | deviceId | http header | device | Y | 字符串 | 固定16字符长度，客户端生成, 每一个字符只能是0-f的16进制字符。最佳实践方式是采用md5算法。|
| 用户id | userId | http url | user | N | 字符串 |  |
| 用户属性 | userProperty | http url | user | N | 字符串 | json格式的单层对象，如{"gender": 1, "age": 6, name: "lvin"} <br/> key必须是由英文大小写字母、数字或下划线"_"组成 <br/> value是字符串、整形或者浮点型数字 |
| 项目id | projectId | http ur | application | Y | 字符串 | 固定16字符长度散列值 |
| 网站id | siteId | http url | application | Y | 字符串 | 固定16字符长度的Hash值 |
| App内嵌H5桥信息 | bridgeInfo | http url |  | N | 字符串 | 如果是App内嵌H5，需要将桥信息上报，目前桥信息包括桥左右的project、site标识信息，例{sourceProjectId: 'xxx', sourceSiteId: 'xxx', destProjectId: 'xxx', destSiteId: 'xxx'}，详见4.7.4 接口实现方式伪代码 |
| UA名称 | uaName | http url | device | N | 字符串 | User agent取值示例请参见https://github.com/ua-parser/uap-java <br/>这些ua信息赋值后，将逐一替换http ader中传递的user-agent解析后的值 |
| UA主版本 | uaMajor | http url | device | N | 字符串 |  |
| UA小版本 | uaMinor | http url | device | N | 字符串 |  |
| UA 操作系统 | uaOs | http url | device | N | 字符串 |  |
| UA 操作系统主版本 | uaOsMajor | http url | device | N | 字符串 |  |
| UA操作系统小版本 | uaOsMinor | http url | device | N | 字符串 |  |
| UA 设备 | uaDevice | http url | device | N | 字符串 |  |
| 经度 | lgt | http url | request | N | double | 客户端经度 |
| 纬度 | lat | http url | request | N | double | 客户端纬度 |
| 客户端分辨率 | resolution | http url | device | N | 字符串 | 长_宽，例：1200*800 |
| 客户端语言 | language | http url | device | N | 字符串 | zh-CN |
| 浏览器插件 | plugin | http url | device | N | 字符串 | 只有js版需要 |
| 客户端网络类型 | netType | http url | device | N | 字符串 | 枚举值：WIFI,3G,4G,EDGE |
| 来源渠道 | channelId | http url | request | N | 字符串 |  |
| 下载渠道 | downloadChannel | http url | request | N | 字符串 |  |
| 应用版本号 | appVersion | http url | request | N | 字符串 |  |
| 页面url | url | http url | page | Y | 字符串 |  |
| 页面标题 | title | http url | page | Y | 字符串 |  |
| 页面referer | referer | http url | page | N | 字符串 |  |
| 页面referer的停留时长 | refererUrlTime | http url | page | N | 长整型 | 上一个页面的停留时长 |
| 页面自定义变量 | customerVar | http url | page | N | 字符串 | Json |
| 事件名称 | eventName | http url | request | Y | 字符串 | 事件名称由英文、数字、下划线、中线组成  |
| 事件内容 | eventBody | http url | request | N | 字符串 | json格式的复杂对象 |


## 3. 传输协议

### 3.1. 单条传输

* 传输方式：http/GET
* 返回值：204，表示传输成功, 其他表示失败。
* 数据包载体：url
* 数据包格式：?key1=utf8UrlEnocode(value1)&key2=utf8UrlEnocode(value2)&...&keyN=utf8UrlEnocode(valueN)
* curl调用示例：

```
假设event的数据是
{
    title: index页
    url: http://localhost:3000/index.html
    referer: http://localhost:3000/index.html
    sessionId: ed79443f2e34ec72
    deviceId: d6b628b2b2569451
    seStartTime: 1526393189091
    resolution: 1680x1050
    language: zh-CN
    plugin: pdf:1;qt:0;realp:0;wma:0;dir:0;fla:0;java:0;gears:0;ag:0;cookie:1
    userId: hhahah
    siteId: 8tN5s7gPDwKiBQIu
    eventTime: 1526393200951
    eventName: pageview
    eventBody: {}
}

// 调用示例
curl 'https://test-tracker.datatist.com/c.gif?title=index%E9%A1%B5&url=http%3A%2F%2Flocalhost%3A3000%2Findex.html&referer=http%3A%2F%2Flocalhost%3A3000%2Findex.html&sessionId=ed79443f2e34ec72&deviceId=d6b628b2b2569451&seStartTime=1526393189091&resolution=1680x1050&language=zh-CN&plugin=pdf%3A1%3Bqt%3A0%3Brealp%3A0%3Bwma%3A0%3Bdir%3A0%3Bfla%3A0%3Bjava%3A0%3Bgears%3A0%3Bag%3A0%3Bcookie%3A1&userId=hhahah&siteId=8tN5s7gPDwKiBQIu&eventTime=1526393200951&eventName=pageview&eventBody=%7B%7D'

```



### 3.2. 批量传输

* 传输方式：http/POST
* 返回值：200，表示传输成功, 其他表示失败。
* 数据包载体：POST BODY
* Content-TYpe: application/x-www-form-urlencoded
* 数据包格式：

```js
    // 批量传输事件
    Array events = [];
    // 事件数据0
    var event0 = key1=utf8UrlEnocode(value1)&key2=utf8UrlEnocode(value2)&...&keyN=utf8UrlEnocode(valueN);
    ...
    // 事件数据N
    var eventN = key1=utf8UrlEnocode(value1)&key2=utf8UrlEnocode(value2)&...&keyN=utf8UrlEnocode(valueN);
    // 将event0 -- eventN 添加入events
    events.push(event0);
    ...
    events.push(eventN);
    // 传输包体
    var postBody = {
        "requests": events
    };
    // 获得传输包体
    var postString = utf8UrlEnocode(jsonToString(postBody));
```

* curl调用示例：

```js
假设event的数据是
[
    {"title":"index页","url":"http://localhost:3000/index.html","referer":"http://localhost:3000/index.html","sessionId":"ed79443f2e34ec72","deviceId":"d6b628b2b2569451","seStartTime":"1526393189091","resolution":"1680x1050","language":"zh-CN","plugin":"pdf:1;qt:0;realp:0;wma:0;dir:0;fla:0;java:0;gears:0;ag:0;cookie:1","userId":"hhahah","siteId":"8tN5s7gPDwKiBQIu","eventTime":1526394846644,"eventName":"pageview","eventBody":{}}
    ,
    {"title":"index页","url":"http://localhost:3000/index.html","referer":"http://localhost:3000/index.html","sessionId":"ed79443f2e34ec72","deviceId":"d6b628b2b2569451","seStartTime":"1526393189091","resolution":"1680x1050","language":"zh-CN","plugin":"pdf:1;qt:0;realp:0;wma:0;dir:0;fla:0;java:0;gears:0;ag:0;cookie:1","userId":"hhahah","siteId":"8tN5s7gPDwKiBQIu","eventTime":1526394853456,"eventName":"search","eventBody":{"keyword":"火龙果","recommendationSearchFlag":0,"historySearchFlag":1,"udVariable":{"a":"abc"}}}
]

// 调用示例
curl -X POST --header "Content-Type: application/x-www-form-urlencoded" 'https://test-tracker.datatist.com/c.gif' -d '%7B%22requests%22%3A%5B%22title%3Dindex%25E9%25A1%25B5%26url%3Dhttp%253A%252F%252Flocalhost%253A3000%252Findex.html%26referer%3Dhttp%253A%252F%252Flocalhost%253A3000%252Findex.html%26sessionId%3Ded79443f2e34ec72%26deviceId%3Dd6b628b2b2569451%26seStartTime%3D1526393189091%26resolution%3D1680x1050%26language%3Dzh-CN%26plugin%3Dpdf%253A1%253Bqt%253A0%253Brealp%253A0%253Bwma%253A0%253Bdir%253A0%253Bfla%253A0%253Bjava%253A0%253Bgears%253A0%253Bag%253A0%253Bcookie%253A1%26userId%3Dhhahah%26siteId%3D8tN5s7gPDwKiBQIu%26eventTime%3D1526394846644%26eventName%3Dpageview%26eventBody%3D%257B%257D%22%2C%22title%3Dindex%25E9%25A1%25B5%26url%3Dhttp%253A%252F%252Flocalhost%253A3000%252Findex.html%26referer%3Dhttp%253A%252F%252Flocalhost%253A3000%252Findex.html%26sessionId%3Ded79443f2e34ec72%26deviceId%3Dd6b628b2b2569451%26seStartTime%3D1526393189091%26resolution%3D1680x1050%26language%3Dzh-CN%26plugin%3Dpdf%253A1%253Bqt%253A0%253Brealp%253A0%253Bwma%253A0%253Bdir%253A0%253Bfla%253A0%253Bjava%253A0%253Bgears%253A0%253Bag%253A0%253Bcookie%253A1%26userId%3Dhhahah%26siteId%3D8tN5s7gPDwKiBQIu%26eventTime%3D1526394853456%26eventName%3Dsearch%26eventBody%3D%257B%2522keyword%2522%253A%2522%25E7%2581%25AB%25E9%25BE%2599%25E6%259E%259C%2522%252C%2522recommendationSearchFlag%2522%253A0%252C%2522historySearchFlag%2522%253A1%252C%2522udVariable%2522%253A%257B%2522a%2522%253A%2522abc%2522%257D%257D%22%5D%7D'

```


## 4. Tracker 采集器设计

### 4.1. 初始化和参数设置

采集器(tracker)在使用前需要初始化，配置tracker的参数

参数定义说明

* set列 表示该参数可以被设置，调用方法tracker.setXxxx，例：参数名称是trackApiUrl，调用方法为setTrackApiUrl("abc")
* get列 表示该参数可以被获得
* once列 表示此参数在整个采集器声明周期只可以被设置一次

采集器可以被设置的参数如下

参数名称 | 参数 | 类型 | set | get | once | 默认值 | 参数意义
--- | --- | --- | --- | --- | --- | --- | ---
采集服务地址 | trackApiUrl | string | Y | Y | N | 无 | 采集器上报的服务器接收地址，例：https://test-tracker.datatist.com/c.gif
采集器开关 | enable | boolean | Y | Y | N | true | true: 正常上报数据，false：停止上报数据。注：采集器可以多次设置开关，关闭后数据立即停止上报，继续调用采集器收集的数据将丢弃
批量采集开关 | batch | boolean | Y | Y | Y | false | 是否打开批量上报，详见 [批量采集接口](https://gitlab.datatist.cn/ruby/datatist-product/blob/master/ji-zhu-wen-dang/datatistshu-ju-cai-96c6-pi-liang-jie-kou.md)
批量采集超时时间(秒) | batchTimeout | int32 | Y | Y | Y | 5 | 批量采集时，如果距离上次上报时间超过batchTimeout，触发批量发送
批量采集的最大单次批量 | batchSize | int32 | Y | Y | Y | 5 | 批量采集时，如果积累的条数超过batchSize，触发批量发送
全埋点开关 | autoTrack | boolean | Y | Y | N | false | 是否开启全埋点
全埋点过滤元素 | autoTrackSkipElements | array | Y | Y | Y | 无 | 如果设置此值：如["img", "a"]，则web的img a元素忽略全埋点上报数据
全埋点收集元素的属性 | autoTrackAttributes | array | Y | Y | Y | 无 | 如果设置此值：如["test"]，那么<a href="http://xxx" test="a test text">link</a> 那么a元素的test属性值将跟随全埋点上报

伪代码示例

```
tracker = new Tracker(); //业务接口皆是tracker的成员方法
//设置tracker参数
tracker.setTrackApiUrl("https://test-tracker.datatist.com/c.gif")
tracker.setBatch(true)
```

### 4.2. Tracker 成员变量生命周期解释

级别的不同体现在变量生效范围

参数级别 | 参数的生命周期
--- | ---
应用级别(device) | 从设置到采集器被释放
会话级别(session) | 从设置到会话结束
用户级别(user) | 从设置到用户登出或者切换用户，如果会话中没有userId，设置用户级别的参数无意义
页面级别(page) | 从设置到页面切换（屏幕切换）
请求级别(request) | 上报后即失效，所以不能设置，只能通过通用接口传递，因为设置没有意义

### 4.3. session描述
#### 4.3.1 session 失效的机制

* 30分钟没有交互就算失效
* 以用户的时区跨天要失效

#### 4.3.2 sessionInfo描述

session信息的结构为一层的key value数据，包含预设session信息和自定义session信息，目前仅设计预设session信息，
```json
{
    "dcid": "xxx", //Datatist定义的campaignID
    "dtg": "xxx" //Datatist定义的targetGroupID
}
```

dcid和dtg的解析方式详见 https://dev-chandao.datatist.com/zentao/story-view-24.html


### 4.4. 通用采集接口（单条）
  * 接口声明：track\(event: json，callback: function\|option\)
  * 传输协议：http/get
  * 调用示例（js方式）：


示例1，收集pageview，并处理返回数据

```js
track(
    {
        siteId: 'a1b2c3d4',
        url:'http://www.baidu.com',
        title:'百度'
        eventName:'pageview'
    },
    function(data) {
        alert(data.code);
    }
);
```

示例2，收集搜索

```js
track(
    {
        siteId: 'a1b2c3d4',
        url:'http://www.baidu.com',
        title:'百度',
        eventName: 'search',
        eventBody: {keyword: '火龙果'},
    }
);
```

### 4.5. 通用采集接口（多条）
  * 接口声明：track\(events: jsonArray，callback: function\|option\)
  * 传输协议：http/post
  * 请求数据示例：http body是urlEncode\(json\) {    "requests": \[         "?siteId=a1b2c3d4&url=xxxxx&title=xxxx",         "?siteId=a1b2c3d4&url=xxxxx&title=xxxx"    \] }

调用示例（js方式）：

```js
track(
    [{
        siteId: 'a1b2c3d4',
        url:'http://www.baidu.com',
        title:'百度'
        eventName:'pageview'
            },{
                siteId: 'a1b2c3d4',
        url:'http://www.baidu.com',
                title:'百度',
        eventName: 'search',
        eventBody: {keyword: '火龙果'}
        }
    ],
    function(data) {
        alert(data.code);
    }
);
```

### 4.6. 批量采集接口

* 开启关闭批量接口功能

> tracker.setBatch(batch: boolean)
  tracker.setBatchTimeout(timeout: int)
  tracker.setBatchSize(size: int)
  tracker.flush() 立即推送

* 使用批量方法示例

```
tracker.setBatch(true);
tracker.setBatchTimeout(10);
tracker.setBatchSize(100);
```

这个示例表示开启批量功能，当超时10秒或者条数积累到100条，这两个条件任一条件达到的时候触发批量发送。

## 4.7. Sdk Js打通

### 4.7.1 背景
  大量客户的App（ios和andriod）客户端中存在内嵌web的做法，当用户的操作从app跳转到html时，app和html由于分处不同的环境，导致session不一致，但是操作的用户确是处于同一个session。

  需要通过SDK JS数据打通用户跨端的session。

### 4.7.2 打通的方式
  1. web端获得或者生成一个bridge，bridge连接web和客户端。

  2. web端将[event元事件](https://gitlab.datatist.cn/ruby/datatist-product/blob/master/ji-zhu-wen-dang/shu-ju-cai-ji-tong-yong-jie-kou.md#%E9%80%9A%E7%94%A8%E6%8E%A5%E5%8F%A3%E5%8F%82%E6%95%B0%E8%AF%A6%E8%A7%A3)通过bridge上报给客户端。

  3. 客户端接收web端传来的event元事件数据，覆盖掉其中的session信息、device信息字段，然后调用[通用采集接口](https://gitlab.datatist.cn/ruby/datatist-product/blob/master/ji-zhu-wen-dang/shu-ju-cai-ji-tong-yong-jie-kou.md#%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89%E5%92%8C%E5%AE%9E%E7%8E%B0%E7%A4%BA%E4%BE%8B)上报给采集服务器。

### 4.7.3 接口定义

  定义桥接采集接收接口，IOS、Andriod端实现，Js端调用

 - 接口声明：bridgeTrack (event: Object|String, callback: function|option)
 - 返回值：void
 - 参数说明：
    - event: [event元事件](https://gitlab.datatist.cn/ruby/datatist-product/blob/master/ji-zhu-wen-dang/shu-ju-cai-ji-tong-yong-jie-kou.md#%E9%80%9A%E7%94%A8%E6%8E%A5%E5%8F%A3%E5%8F%82%E6%95%B0%E8%AF%A6%E8%A7%A3)
    包含整个埋点产生的事件数据，和js向采集服务器发送的数据结构和内容一样
    - callback: 回调函数

### 4.7.4 接口实现方式伪代码
  - IOS Andriod 需要实现

```java

  /**
   * 桥接采集接口
   * @param  {Event} event         元事件数据
   * @param  {Function} function   回调函数
   * @return {void}
   */
  void bridgeTrack(Event h5Event, Function callback) {
    // 生成发送的事件对象，对象中对象中包括 session、devicedeng等属性
    Event sendEvent = .......... // 初始化发送事件，事件对象中，应包括基础信息，如用户信息、会话信息（userId，userProperty)，项目和应用信息(projectId, siteId)
    // 将从js端获得的事件的属性赋值给sendEvent
    // 需属性包括 (eventTime plugin url  title  referer customerVar eventName eventBody)
    sendEvent.eventTime = h5Event.eventTime
    sendEvent.plugin = h5Event.plugin
    sendEvent.url = h5Event.url
    sendEvent.title = h5Event.title
    sendEvent.referer = h5Event.referer
    sendEvent.customerVar = h5Event.customerVar
    sendEvent.eventName = h5Event.eventName
    sendEvent.eventBody = h5Event.eventBody

    // 设置桥信息
    sendEvent.bridgeInfo = new BridgeInfo()
    sendEvent.bridgeInfo.sourceProjectId = h5Event.projectId; // h5的projectId
    sendEvent.bridgeInfo.sourceSiteId = h5Event.siteId; // h5的siteId
    sendEvent.bridgeInfo.destProjectId = app的projectId
    sendEvent.bridgeInfo.destSiteId = app的siteId

    // 始终使用H5的projectId,siteId上报数据
    sendEvent.projectId = h5Event.projectId
    sendEvent.siteId = h5Event.siteId

    // 如果是登录事件做特殊处理
    if (h5Event.eventName 是 'login') {
      // 设置用户id
      tracker.setUserId(h5Event.eventBody.uid)
    }

    // 调用通用采集接口
    tracker.track(sendEvent, function() {
      // 如果是登出事件，回调时要清空userId
      if (h5Event.eventName 是 'logout') {
        tracker.setUserId(null)
      }
      callback();
    });
  }
```

  - Js 调用伪代码

```js
    // 假设track是js端的通用采集接口
    // 假设tracker是js的采集器实例
    // tracker.agent是web客户端信息

    /**
     * 通用采集接口
     * @param  {object} event 元事件数据
     * @return {void}
     */
    function track(event, callback) {
      if (tracker.agent是ios) {
        iosBridge.bridgeTrack(event, callback);
      }
      else if(tracker.agent 是andriod) {
        androidBridge.bridgeTrack(event, callback);
      }
      // 不是IOS andriod内嵌页面，走原先的逻辑
      else {
        // 发送请求到采集服务器
        sendRequest(event, callback);
      }
    }
```

## 4.9. 全埋点和trackClick

### 4.9.1 全埋点实现方式

拦截web、ios、andriod点击事件，将点击事件对应元素的相关属性以trackClick的方式上报

### 4.9.2 trackClick接口定义

  - 接口声明：trackClick \(clickEvent: Json, callback: function\|option\)
  - 返回值：void
  - 参数说明：
    - clickEvent: json对象，

字段标识 | 字段名称 | 字段类型 | 是否必传 | 描述
--- | --- | --- | --- | --- |
id | 埋点id | string | 是 | 用于标识埋点的id，应用范围唯一，生成算法，md5("datatist" +url + ePath).subString(0,16)
eId | 元素id | string | 否 | 元素上的id
eType | 元素类型 | string | 是 | 元素类型，如html的a img
eContent | 元素内容 | string | 否 | 元素内容，如按钮上的文字
ePath | 元素路径 | string | 是 | 元素的定位，由ePath和url可以唯一确认一个元素
ePosition | 元素位置 | string | 否 | 列表元素点击子元素的位置，从0开始

  - 调用通用接口示例：

```
      track({
        url: 'xxxx',
        title: 'xxxxx',
        ... session device 信息
        eventName: 'click',
        eventBody: {
          id: 'xxxx',
          eId: 'xxxx',
          ePath: 'xxxx',
          ....
        }
      })
```

* 全埋点示例

配置示例

```
tracker = new Tracker()

// 开启全埋点
tracker.setAutoTrack(true)
// 设置全埋点不上报的元素
tracker.setAutoTrackSkipElements(["a"])
// 设置全埋点上报的元素属性
tracker.setAutoTrackAttributes(["alt"])
```

当用户点击未被过滤的页面元素时，trackClick接口将自动调用

示例1：忽略a元素以及a元素的子元素

html 代码如下

```
<!-- 此元素将不被自动上报，因为a标签被禁用了 -->
<a href=""><img src=""></a>

<img id="ad1" src="http://datatist/a.jpg" alt="图片">
```

全埋点自动上报调用如下

```js
trackClick({
  id: "1234567890123456", // 实际值请参考id的算法
  eId: "ad1",
  eType: "img"
  ePath: "/img[0]"
  alt: "图片",
});
```
> 注：url，title，sessionId等page级别、session级别、device级别变量，使用变量覆盖规则

示例2：列表子元素点击采集

html 代码如下

```html
<ul>
  <li>1. 包子</li>
  <li>2. 混沌</li>
  <li>3. 油条</li>
</ul>
```

当用户点击“2. 混沌"时，自动上报调用如下

```js
trackClick({
  id: "1234567890123456", // 实际值请参考id的算法
  eType: "li",
  ePath: "/ul[0]/li[1]",
  ePosition: 1
});
```

## 4.10. 自定义事件

自定义事件可以帮助客户采集业务采集接口之外的数据，业务采集接口也可称为预设接口。

### 4.10.1. 自定义接口定义

  * 接口声明：customerTrack(eventName: String, eventProperty: Json, callback: function\|option\)
  * 返回值：void
  * 参数说明：
      * eventName: 事件名称，标识符，自定义的eventName规则如下：
          * 由英文大小写字母、数字组成
      * eventProperty：单层key-value结构的json对象
          * key必须是由英文大小写字母、数字或下划线"_"组成
          * value是字符串、整形或者浮点型数字
  * 调用示例

```js
tracker = new Tracker();
tracker.setUserProperty({"gender": 1, "age": 6, "name": "lvin"});
tracker.customerTrack("myPageview", {myValue1: "fun", myValue2: "yun"});
```

以上代码如果采用通用代码调用，伪代码如下
```
tracker = new Tracker();
tracker.track({
  eventName: "myPageview",
  eventBody: "{myValue1: 'fun', myValue2: 'yun'}",
  userProperty: "{gender: 1, age: 6, name: 'lvin'}"
});

```

