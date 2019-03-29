# Datatist数据采集-部署文档

## 必须的部署条件

* 名词解释
  * message server：表示整个采集服务，包括nginx+logstash
* 操作系统
* 目前支持的操作系统有：centos7
* 软件
  * nginx-1.9.6
  * logstash6.1.2
  * kafka-0.10.0.1
  * jdk-8u101
  * spark-2.2.0
  * mysql-5.6.0
  * redis-3.2.3
* 硬件资源

| 资源 | 数量 | 用途 | 备注 |
| :--- | :--- | :--- | :--- |
| 负载均衡 | 1 | 对数据采集服务器进行负载分配 | 必须拥有https unload功能 |
| linux主机 | 4 | 数据初步采集 | 需安装nginx、logstash、jdk |
| mysql主机 | 1 | 存储相应的用户数据 | |
| redis主机 | 1 | 计算的缓存 | 8G容量 |
| spark计算资源 | 4 | 计算服务器 | 总计算资源最低在32核，120G内存 |

## 部署步骤

1. [部署message server](#部署message-server)

2. 部署数据清洗spark服务


### 部署message server

* #### 主机准备

| 配置方案 | 主机台数 | cpu | 内存 | 磁盘 | 网络 | |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 最低配置 | 1 | 4核 | 8G | 1T | 100Mbps | |
| 高可用配置 | 2-N | 8核 | 32G | 4T | 1000Mbps | |

> 参考配置：
>
> 日pv 1亿，主机配置：4台8核32G10T

* #### 域名、证书准备

	准备一个域名供message server使用，这个域名将用于埋码时指向的服务器接收地址

	如需https安全访问，需要准备相应域名的证书申请工作

* #### 端口开放

	如主机有防火墙或者在防火墙后，需要开通相应的端口和路由

* #### 操作系统初始化

	需要在每一台主机上做如下初始化操作，如果初始化步骤有变化，需要将变化的部分应用到每一台主机上面，避免系统不一致带来的管理成本

	安装基础软件包，这一步非必须，要根据实际的系统情况而定，如果不安装可能会导致某些软件不能编译

	> yum install telnet wget curl nmap-ncat vim net-tools rpm-build tree gettext-devel openssl-devel perl-CPAN perl-devel zlib-devel curl-devel automake binutils bison flex gcc gcc-c++ gettext libtool make patch pkgconfig redhat-rpm-config rpm-build rpm-sign

* #### 安装、启动、验证nginx服务

	安装：从ftp 40.125.174.49 下载/temp/nginx.tar.gz，解压缩到工作目录

	启动：
	cd nginx目录;
	./sbin/nginx -p ./

	验证：
	curl http://localhost:8080/c.gif
	如果没有报错，并且在nginx工作目录下logs/出现access_message_server.log.xxxxxxx文件，并且日志中出现相应日志，则验证成功

* #### 安装jdk，下面方式供参考

	> wget -c --header "Cookie: oraclelicense=accept-securebackup-cookie" [http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.tar.gz](http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.tar.gz) && tar xzvf jdk-8u131-linux-x64.tar.gz -C /usr/local/jdk
	>
	> JAVA\_HOME=/usr/local/jdk/jdk1.8.0\_131
	>
	> PATH=$JAVA\_HOME/bin/:$PATH

* #### 安装、启动logstash

	定义环境变量：
		定义nginx的工作目录
		export NGINX_HOME=xxxx/nginx
		定义kafkaserver
		export KAFKA_SERVERS="cdh-slave1:9092,cdh-slave2:9092,cdhmaster:9092"
		定义kafk topic id
		export TOPIC_ID="datatist-message"
		定义sincedb 路径
		export SINCEDB_PATH=logstash工作目录/logs/sincedb

	启动：cd logstash工作目录 && ./bin/logstash -f conf/logstash.conf


* #### 内网测试、验证message server

	```curl 'http://localhost:8080/c.gif?title=index%E9%A1%B5&url=http%3A%2F%2Flocalhost%3A3000%2Findex.html&referer=&sessionId=fe15e13a6204525d&deviceId=40ad12d9e965293f&seStartTime=1523360442757&resolution=1920x1080&language=zh-CN&plugin=pdf%3A1%3Bqt%3A0%3Brealp%3A0%3Bwma%3A0%3Bdir%3A0%3Bfla%3A0%3Bjava%3A0%3Bgears%3A0%3Bag%3A0%3Bcookie%3A1&userId=yourUserId&eventTime=1523360453542&eventName=pageview&eventBody=%7B%22udVariable%22%3A%22obj%22%7D'```

	使用命令消费定义的${TOPIC_ID}


* #### 外网测试、验证message server

	启动好集群，配置好负载均衡和https unload（如果有），打开浏览器，输入url：http|https://${申请的域名}/c.gif?title=index%E9%A1%B5&url=http%3A%2F%2Flocalhost%3A3000%2Findex.html&referer=&sessionId=fe15e13a6204525d&deviceId=40ad12d9e965293f&seStartTime=1523360442757&resolution=1920x1080&language=zh-CN&plugin=pdf%3A1%3Bqt%3A0%3Brealp%3A0%3Bwma%3A0%3Bdir%3A0%3Bfla%3A0%3Bjava%3A0%3Bgears%3A0%3Bag%3A0%3Bcookie%3A1&userId=yourUserId&eventTime=1523360453542&eventName=pageview&eventBody=%7B%22udVariable%22%3A%22obj%22%7D

### 部署数据清洗spark服务
