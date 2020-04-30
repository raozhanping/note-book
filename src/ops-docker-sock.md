## 关于 docker.sock 的理解

- docker.sock 文件是干什么的
- 如何确定 docker.sock 文件的位置
- 如何使用 docker 的事件流进行测试
- 事件流不用进入 docker 内测试，在物理机上也是可以的
- curl --unix-socket /var/run/docker.sock http://localhost/events

## docker 网络配置

- -b BRIDGE or -bridge=BRIDGE 指定容器挂载的网桥
- -bip=CIDR 定制 docker0 的掩码
- -H SOCKET... or --host=SOCKET... Docker 服务端接受命令的通道
- icc=true|false 是否支持容器之间进行通信
- -ip-forward=true|false 请看下文容器之间的通信
- -iptable=true|false 禁止 Docker 添加 iptables 规则
- -mtu=BYTES 容器网络中的 MTU 

下面两个命令选项即可以在启动服务时指定，也可以在 Docker 容器启动（docker run
时候指定。

- -dns=IP_ADDRESS... 使用指定的 DNS 服务器
- -dns-search=DOMAIN... 指定 DNS 搜索域

最后这些只有在 docker run 执行时使用

- -h HOSTNAME or -hostname=HOSTNAME 配置容器主机名
- -link=CONTAINER_NAME:ALIAS 添加到另一个容器的连接
- -net=bridge|none|container:NAME_or_ID|host 配置容器的桥接模式
- -p SPEC or -publish=SPEC 映射容器端口到宿主主机
- -P or -publish-all=true|false 映射容器所有端口到宿主主机


