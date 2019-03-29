# DATATIST-第三方对接对接方案


```
文档名称：Datatist大数据技术整体设计方案
文档版本: 1.0.0
文档分类：技术部-设计文档
作 者: 赵 鑫
联系电话：13701326552
电子邮件：xin.zhao@datatist.com
```

## 联系人

|  | 联系人 | 邮箱 |
| :---: | :---: | :---: |
| 第一联系人 | 赵鑫 | xin.zhao@datatist.com |

## 文档历史

```diff
+ 2019-03-26 创建文档
```

## 背景和痛点

Datatist公司的业务表现为多应用，如mc，analyzer，uc，ai等。随着业务的发展，应用还会变的更多，以及二次开发应用的加入。为了维持多个应用的登录以及权限等状态信息，各个应用不得不分别对接统一登录平台，并实现权限管理。

目前我们的发布环境除sass版，还有很多私部版。每个私部版本对接环境各不相同，而且无法预知以后将会对接的环境，每一次对接都需要各个应用的负责团队进行对接的改造，对接的成本极高，而且致使核心团队不能专注于业务的开发。

## 改造目标

* 业务组通过一次性改造对接统一的接入层，由对接层对接第三方应用。

* 业务组不再需要关注登录、注册、公司等租户信息，由对阶层提供相应接口。

* 业务组不再关注权限、角色等信息，由对阶层提供接口。


## 业务对接系统改造设计

![image](https://gitlab.datatist.cn/ruby/datatist-product/raw/master/ji-zhu-wen-dang/_res/app-gate-frame.jpg)
![image](https://gitlab.datatist.cn/ruby/datatist-product/raw/master/ji-zhu-wen-dang/_res/app-gate-sequence.jpg)

* 对接层，包括前后端两个部分，前端和后端。前端负责和第三方前端系统对接，获得第三方的前端信息，比如url、cookie等认证信息，传递给后端对接层，后端对接层对接第三方应用后端，保存session信息。

* 己方业务app通过iframe嵌入前端对接层，从前端对接层获得cookie中的session key，传递给业务app的后端，业务app后端用session key从后端对接层换回session信息从而实现登录。

* 业务app无需处理登录和登出。

* 权限信息可以通过对接层获得，或者直接调用接口判断本次调用是否有权限。

## 对接层接口定义

### 前端技术描述和接口定义

前端对接层由一系列接口和消息框架组成。

* 接口提供全局功能并避免多应用组重复开发，统一风格。
* 消息框架，对接层前端框架发生状态变化时会向队列中投递一条消息，比如项目切换、用户修改密码等，业务app可以根据自身需要决定是否要消费这些消息，并作出相应改变。

#### 获得session key

* 名称：DATATIST_APP_GATE.getSessionKey()
* 返回：(String) session key
* 描述：获得session key，这个key可以用于后端取回用户session信息

#### 展示隐藏框架

* 名称：DATATIST_APP_GATE.showFrame(frameObj, showOrHide, callback)

#### 获得框架信息

* 名称: 名称：DATATIST_APP_GATE.getFrameStatus()
* 返回: (Object) { header: true|false, menu: true|false }

#### 展示提示信息

* 名称：DATATIST_APP_GATE.showToastMessage(title, message, level, option)

#### 系统消息描述

* SWICH_PROJECT, projectId
* MODIFY_USER_INFO
* HIDE_MENU
* HIDE_HEADER


### 后端技术描述和接口定义

* 调用风格：rest
* 调用协议：post或get
* 返回值描述：返回值为json对象，包括头和体。
```
header： 返回头
    code：(integer) 0 表示成功，其他表示失败
    message：错误或成功信息
body：返回体，实际的业务对象
```

* 返回示例
``` js
{
	header: {
		code: 0
		message: 'success'
	},
	body: {
		a: 1,
		b: 2
	}
}
```

#### 获得用户信息

* 地址：/appGate/getUserInfo.json
* 协议：GET
* 参数：
	* (String) sessionKey
* 返回：如果sessionKey校验通过，header.code等于0，用户信息将从body返回，否则header.code返回非0，header.message返回错误信息，body返回空。

#### 获得公司信息

* 地址：/appGate/getCompanyInfo.json
* 协议：GET
* 参数：
	* (String) sessionKey
* 返回：如果sessionKey校验通过，header.code等于0，公司信息将从body返回，否则header.code返回非0，header.message返回错误信息，body返回空。

#### 获得当前项目信息

* 地址：/appGate/getCurrentProjectInfo.json
* 协议：GET
* 参数：
	* (String) sessionKey
* 返回：如果sessionKey校验通过，header.code等于0，项目信息将从body返回，否则header.code返回非0，header.message返回错误信息，body返回空。

#### 获得权限列表

#### 权限校验


