## Docker

### 简介

> Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。 容器是完全使用沙箱机制，相互之间不会有任何接口。

一个完整的 Docker 有以下几个部分组成：  

1. dockerClient 客户端
2. Docker Daemon 守护进程
3. Docker Image 镜像
4. DockerContainer 容器

**1. docker commit**
1. 通过 commit 创建容器的一个小缺陷,不能自动执行命令或添加 entrypoint;

2. commit 创建镜像时添加自动运行CMD和entrypoint (-c --change string)

**2. 使用默认网络配置启动容器**
通过使用网络驱动,docker包含了对容器网络的支持.默认情况下,docker为容器提供了两种网络模式: **桥接(bridge)网络** 和 **覆盖(overlay)网络** 你也可以使用自定义网络驱动插件创建自定义的网络支持,不过这属于高级行为.  

**3. 管理容器的数据**
docker Engine 提供了两种方式管理容器的数据:  
- 数据卷
- 数据卷容器

1. **数据卷**
数据卷是一个或多个容器绕过 Union File System 而指定的一个特殊目录. 数据卷为数据持久化和共享提供了一些有用的功能.  
- 卷在创建容器的时候被初始化.如果容器的基础镜像在卷的挂载点目录中有数据,那么这些数据会哦被复制到初始化后的卷上.
- 数据卷可以在容器之间共享和复用
- 数据卷的修改实时生效
- 更新镜像时不会影响数据卷
- 即使容器被删除数据卷也会存在

数据卷是为了在容器生命周期内,数据的持久化,独立性而设计的. 因此docker永远不会在删除容器的时候删除数据卷. 也不会将数据卷放入 "回收站"而不让容器重新使用.  

2. **添加数据卷**
在使用 dcoker creaste 或 docker run 命令的时候,使用 -v标识可以为容器添加数据卷.多次使用 -v 可以为容器添加多个数据卷.

**4. Dockerfile 指令详解**
1. COPY 复制文件
格式:  
  - COPY <源路径>... <目标路径>
  - COPY ["<源路径1>",... "<目标路径>"]  
2. ADD 更高级的复制文件
 附加 解压等复杂功能
3. CMD 容器启动命令
CMD 指令的格式和 RUN 相似,也是两种格式:  
  - shell 格式:　 CMD <命令>
  - exec 格式：CMD ["可执行文件", "参数1", "参数2"...]
  - 参数列表格式：CMD ["参数1", "参数2"...]。在指定 ENTRYPOINT 指令后，用 CMD 指定具体的参数。
4. ENTRYPOINT 入口点
ENTRYPOINT 的格式和 RUN指令格式一样, 分为 exec 格式和shell 格式.  
ENTRYPOINT的目的和 CMD一样,都是在指定容器启动程序及参数.ENTRYPOINT 在运行时也可以替代,不过比CMD要略显繁琐,需要通过 docker run 的参数 --entrypoint 来指定.  
当指定了 entrypoint 后,CMD 的含义就发生了改变,不再是直接的运行其命令,而是将CMD 的内容作为参数传给 entrypoint 指令, 换句话说实际执行时,将变为:　

```
<ENTRYPOINT> "<CMD>"
```
5. ENV 设置环境变量
格式有两种：　　
  - ENV <key> <value>
  - ENV <key>=<value> <key>=<value>
6. ARG 构建参数
格式:　ARG <参数名>[=<默认值>]
7. VOLUME 定义匿名卷
格式: 
  - VOLUME ["<路径1>", "<路径2>"...]
  - VOLUME <路径>
8. EXPOSE 声明端口
格式为 EXPOSE <端口1> [<端口2>...]
9. WORKDIR 指定工作目录
格式为 WORKDIR <工作目录路径>
10. USER 指定当前用户
11. HEALTHCHECK 健康检查
  - HEALTHCHECK [选项] CMD <命令> :　设置检查容器健康状况的命令
  - HEALTHCHECK NONE:　如果基础镜像有健康检查指令,使用这行可以屏蔽掉其健康检查命令指令
12. ONBUILD 为他人做嫁衣裳

**3.**
**3.**
