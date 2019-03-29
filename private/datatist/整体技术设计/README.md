# Datatist大数据技术整体设计方案

```
文档名称：Datatist大数据技术整体设计方案
文档版本: 2.0.0
文档分类：技术部-设计文档
作 者: 赵 鑫
联系电话：13701326552
电子邮件：xin.zhao@datatist.com
```

## 联系人

|  | 联系人 | 邮箱 |
| :---: | :---: | :---: |
| 第一联系人 | 赵鑫 | xin.zhao@datatist.com |
| 第二联系人 | 祁云峰 | frankie@datatist.com |
| 第三联系人 | 杜均 | sandy.du@datatist.com |

## 目录


## 1. 前言

### 1.1. 内容简介

本文详细描述了Datatist技术的顶层设计和技术细节以及数据校验方案、运维方案等。帮助开发人员了解整体架构，指导开发。帮助运维人员实施运维方案，收集系统的健康性指标。辅助架构师做技术升级和改造以及技术扩展。

### 1.2 读者范围

* 架构师
* 开发工程师
* 运维工程师
* 数据工程师

## 2. 设计目标

  将客户数据采集下来，经过加工处理分发到大数据数据库供前端应用调用。

![image](https://gitlab.datatist.cn/ruby/datatist-product/raw/master/ji-zhu-wen-dang/%E6%95%B4%E4%BD%93%E6%8A%80%E6%9C%AF%E8%AE%BE%E8%AE%A1/assets/%E6%95%B0%E6%8D%AE%E6%B5%81%E8%BD%AC%E5%9B%BE.jpg)

  * 数据采集
    * 事件数据
    由终端用户操作所产生的数据，如登录会产生登录事件，注册会产生注册事件。事件数据主要描述谁在什么时间，通过什么设备，做了什么操作。
    * 业务数据
    客户业务相关的数据，如B2B类型客户的产品数据，GIS类型客户的地理信息数据等，政务类客户的部门信息数据。这些数据会参与大数据分析。
  * ETL
    事件数据和业务数据的物理形式可能是文件、数据库、Excel等不同的存储方式，需要通过ETL来将数据转化成Datatist大数据平台标准格式
  * 消息队列
    消息队列接收ETL发来的数据，这个数据必须符合Datatist数据标准格式，否则会被丢弃。
  * 大数据存储
      * 消息队列中的数据经过消费，流入大数据存储。
      * 大数据存储由一个或者多个存储组件构成，由应用场景决定。
      * 存储应考虑的主要指标：
          * 高可用性
          * 大容量
          * 维护成本低
          * 伸缩性
          * 数据冗余
          * 实时性
          * 高效多维分析
          * 高吞吐
          * 随机读写
          * 顺序读写
          * 开源，社区活跃
  * 应用
    * 数据云
    * 营销云
    * ...



## 3. 数据收集技术设计

### 3.1. 设计目标

  * 不关心数据的产生，关心从数据产生后一直到流入业务库的过程。
  * 对数据不做复杂的处理和加工，复杂的处理放在定时任务或批量处理中。
  * 数据从流入到流出到业务数据库是一个很短的过程，具备一定的实时性。
  * 数据有效性校验。

### 3.2. 数据收集架构图

  ![image](https://gitlab.datatist.cn/ruby/datatist-product/raw/master/ji-zhu-wen-dang/%E6%95%B4%E4%BD%93%E6%8A%80%E6%9C%AF%E8%AE%BE%E8%AE%A1/assets/%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1.jpg)

### 3.3. 组件功能描述

由图中带指向绿色圆圈标识，标识号全文档唯一，后面的图还会引用此编号。

#### 组件1 nginx

接收客户端(web、ios、andriod)发来的数据，将数据存储为日志文件

  * 接收GET和POST请求
    GET请求接收数据采集中的单条数据
    POST请求接收数据采集中的批量数据
  * 写入日志文件
    使用access log记录日志
    日志按天分割
    日志文件定期归档、清除

#### 组件2 logstash
简单数据清洗，清洗后的数据投入kafka

  * 解析nginx access log记录日志
  * 解析url encoded数据
  * 解析数据包中的json数据
  * 附加地理信息
  * 解析浏览器信息
  * 断点续传
  * 丢弃错误数据，打印错误日志
  * 生成event数据
  * 投入kafka

#### 组件3 kafka

  * 维持event数据队列

#### 组件4 spark streaming

* 消费kafka中的event数据
* 过滤无效数据
* join项目信息
* 计算session数据
* 投递进HBase和Elastic Search

#### 组件5 HBase

  * event数据
  * session数据

#### 组件6 Elastic Search

  * event和session join 后的数据

#### 组件7 mysql

  * 提供项目信息数据

## 4.1. 任务调度架构图

  ![image](https://gitlab.datatist.cn/ruby/datatist-product/raw/master/ji-zhu-wen-dang/%E6%95%B4%E4%BD%93%E6%8A%80%E6%9C%AF%E8%AE%BE%E8%AE%A1/assets/%E6%89%B9%E9%87%8F%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86.jpg)

### 4.2. 任务调度架构简述

收集来的数据存储于HBase库，由于HBase在多维分析中的效率较差，所以需要将数据导入Hive+parquet库，供数据云使用。

### 4.3. 组件功能描述

#### 组件5 HBase

  * 提供Event、Session数据供Spark调用

#### 组件8 spark

  * 定期将HBase中的event、session当天数据同步到Hive
  * 同步周期是每小时1次，每次同步当天全部数据

#### 组件9 Hive/Parquet

  * 存储event、session、国家、地区、分群等数据

## 5.1. 数据应用架构图

  ![image](https://gitlab.datatist.cn/ruby/datatist-product/raw/master/ji-zhu-wen-dang/%E6%95%B4%E4%BD%93%E6%8A%80%E6%9C%AF%E8%AE%BE%E8%AE%A1/assets/%E6%95%B0%E6%8D%AE%E5%BA%94%E7%94%A8%E6%9E%B6%E6%9E%84.jpg)

### 5.3. 组件功能描述

#### 组件5 HBase

  * 提供Event、Session随机读

#### 组件6 Elastic Search

  * 提供营销云统计分析功能

#### 组件7 mysql

  * 提供业务数据
  * 存储计算中间结果

#### 组件9 Hive/Parquet

  * 提供event、session、国家、地区、分群等数据

#### 组件10 dubbo

  * 提供web应用的api
  * 调用存储组件

#### 组件11 Spark Thrift Server

  * Spark Sql 服务

#### 组件12 zookeeper

  * 注册dubbo

## 6. 运维方案

### 6.1. 组件监控

#### 组件1 nginx
  * 端口监控
  * 进程监控

#### 组件2 logstash
  * 进程监控
  * jvm监控
  * 数据异常监控

#### 组件3 kafka
  * 端口监控
  * 进程监控
  * jvm监控
  * 数据消费及时性监控

#### 组件4 spark streaming
  * 端口监控
  * 进程监控
  * jvm监控
  * 数据丢弃监控

#### 组件5 HBase
  * 端口监控
  * 进程监控
  * jvm监控
  * 数据异常监控

#### 组件6 Elastic Search
  * 端口监控
  * 进程监控
  * jvm监控
  * 数据异常监控

#### 组件7 mysql
  * 端口监控
  * 进程监控

#### 组件8 spark 批量处理
  * 端口监控
  * 进程监控
  * jvm监控
  * 数据异常监控

#### 组件9 Hive/Parquet
  * 端口监控
  * 进程监控
  * 数据异常监控

#### 组件10 dubbo
  * 端口监控
  * 进程监控
  * jvm监控

#### 组件11 Spark Thrift Server
  * 端口监控
  * 进程监控
  * jvm监控

#### 组件12 zookeeper
  * 端口监控
  * 进程监控
  * jvm监控

### 6.2. 组件维护、升级

#### 组件1 nginx
  * 流量低时进行
  * nginx安装目录不可以变
  * nginx日志不可删除，不能改变位置


  1. F5下其中一台nginx
  1. 停nginx
  1. 升级
  1. 启动nginx
  1. F5挂上这台nginx
  1. 重复以上动作在所有nginx主机

#### 组件2 logstash
  * 只更新logstash运行程序，日志、配置文件等不可变动位置


  1. 停止logstash，等待进程自动结束，不能kill -9，使用kill {进程号}
  2. 升级
  3. 启动

#### 组件3 kafka
  * 需保证维护升级不影响历史数据


  1. 停止logstash
  1. 等待10分钟，把悬空数据落地
  1. 停止kafka
  1. 维护升级
  1. 启动kafka
  1. 启动logstash

#### 组件4 spark streaming
  1. 停止logstash
  1. 等待10分钟，把悬空数据落地
  1. 停止spark streaming
  1. 维护升级
  1. 启动spark streaming
  1. 启动logstash

#### 组件5 HBase
  * 需保证维护升级不影响历史数据


  1. 发布停服通知，因为hbase会影响前端业务运行
  1. 停止logstash
  1. 等待10分钟，把悬空数据落地
  1. 停止HBase
  1. 维护升级
  1. 启动HBase
  1. 启动logstash

#### 组件6 Elastic Search
  * 需保证维护升级不影响历史数据


  1. 发布停服通知，因为 Elastic Search会影响前端业务运行
  1. 停止logstash
  1. 等待10分钟，把悬空数据落地
  1. 停止 Elastic Search
  1. 维护升级
  1. 启动 Elastic Search
  1. 启动logstash

#### 组件7 mysql
  * 需保证维护升级不影响历史数据


  1. 发布停服通知，因为 mysql会影响前端业务运行
  1. 停止logstash
  1. 等待10分钟，把悬空数据落地
  1. 停止 mysql
  1. 维护升级
  1. 启动 mysql
  1. 启动logstash

#### 组件8 spark 批量处理

  1. 停止spark
  1. 维护升级
  1. 启动spark

#### 组件9 Hive/Parquet
  * 需保证维护升级不影响历史数据


  1. 发布停服通知，因为 Hive/Parquet会影响前端业务运行
  1. 停止组件8 spark 批量处理
  1. 停止 Hive
  1. 维护升级
  1. 启动 Hive
  1. 启动组件8 spark 批量处理

#### 组件10 dubbo

  1. 发布停服通知
  1. 停止
  1. 维护升级
  1. 启动

#### 组件11 Spark Thrift Server

  1. 发布停服通知
  1. 停止
  1. 维护升级
  1. 启动

#### 组件12 zookeeper

  1. 发布停服通知
  1. 停止
  1. 维护升级
  1. 启动

### 6.3. 异常恢复

异常的原因不在本章讨论，具体问题需具体分析。本章只讨论异常后的恢复

#### 组件1 nginx

  首先从F5下掉异常的nginx主机。如果，nginx服务可恢复，恢复后重新挂到F5即可。如果，服务不可恢复，如果不可恢复，等logstash消费完数据，可以完全删除此故障节点。 如果硬盘损坏，那么数据将丢失。

#### 组件2 logstash

  如果可恢复，重启即可。
  如果不可恢复，备份logstash工作目录到新的logstash上，启动即可。

#### 组件3 kafka

  kafka挂掉概率较低，如果发生，停掉logstash，kafka回复后，重启logstash

#### 组件4 spark streaming

  重启即可

#### 组件5 HBase
  * 数据不可丢失，丢失只能从nginx日志部分恢复数据

  1. 停止logstash
  1. 午夜后修复前一天的数据

#### 组件6 Elastic Search

  1. 停止logstash
  1. 午夜后修复前一天的数据

#### 组件7 mysql

  * 数据不可丢失，丢失将无法恢复


  1. 停止logstash
  1. 停止数据云、营销云
  1. 修复mysql
  1. 重启数据云、营销云
  1. 重启logstash
  1. 午夜后修复前一天的数据

#### 组件8 spark 批量处理

  * 修复spark重启即可

#### 组件9 Hive/Parquet

  * 如果数据丢失，需要从HBase恢复数据


  1. 停止组件8 spark批处理任务
  1. 恢复Hive
  1. 重启组件8 spark批处理任务

#### 组件10 dubbo

  * 仅需要恢复dubbo服务

#### 组件11 Spark Thrift Server

  * 仅需要恢复此服务

#### 组件12 zookeeper

  * 仅需要恢复此服务


