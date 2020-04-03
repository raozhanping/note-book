## Docker

- [简介](#简介)
- [1. docker commit](#1-docker-commit)
- [2. 使用默认网络配置启动容器](#2-使用默认网络配置启动容器)
- [3. 管理容器的数据](#3-管理容器的数据)
- [4. Dockerfile 指令详解](#4-dockerfile-指令详解)
- [5. Compose](#5-compose)

### 简介

> Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。 容器是完全使用沙箱机制，相互之间不会有任何接口。

一个完整的 Docker 有以下几个部分组成：  

1. dockerClient 客户端
2. Docker Daemon 守护进程
3. Docker Image 镜像
4. DockerContainer 容器

### 1. docker commit
1. 通过 commit 创建容器的一个小缺陷,不能自动执行命令或添加 entrypoint;

2. commit 创建镜像时添加自动运行CMD和entrypoint (-c --change string)

### 2. 使用默认网络配置启动容器
通过使用网络驱动,docker包含了对容器网络的支持.默认情况下,docker为容器提供了两种网络模式: **桥接(bridge)网络** 和 **覆盖(overlay)网络** 你也可以使用自定义网络驱动插件创建自定义的网络支持,不过这属于高级行为.  

### 3. 管理容器的数据
docker Engine 提供了两种方式管理容器的数据:  
- 数据卷
- 数据卷容器

**3.1 数据卷**
> 数据卷是一个或多个容器绕过 Union File System 而指定的一个特殊目录. 数据卷为数据持久化和共享提供了一些有用的功能.  
- 卷在创建容器的时候被初始化.如果容器的基础镜像在卷的挂载点目录中有数据,那么这些数据会哦被复制到初始化后的卷上.
- 数据卷可以在容器之间共享和复用
- 数据卷的修改实时生效
- 更新镜像时不会影响数据卷
- 即使容器被删除数据卷也会存在

数据卷是为了在容器生命周期内,数据的持久化,独立性而设计的. 因此docker永远不会在删除容器的时候删除数据卷. 也不会将数据卷放入 "回收站"而不让容器重新使用.  

**3.2 添加数据卷**
在使用 dcoker creaste 或 docker run 命令的时候,使用 -v标识可以为容器添加数据卷.多次使用 -v 可以为容器添加多个数据卷.

### 4. Dockerfile 指令详解
**4.1. COPY 复制文件**
格式:  
  - COPY <源路径>... <目标路径>
  - COPY ["<源路径1>",... "<目标路径>"]  

**4.2. ADD 更高级的复制文件**
  - 附加 解压等复杂功能

**4.3. CMD 容器启动命令**
CMD 指令的格式和 RUN 相似,也是两种格式:  
  - shell 格式:　 CMD <命令>
  - exec 格式：CMD ["可执行文件", "参数1", "参数2"...]
  - 参数列表格式：CMD ["参数1", "参数2"...]。在指定 ENTRYPOINT 指令后，用 CMD 指定具体的参数。

**4.4 ENTRYPOINT 入口点**
ENTRYPOINT 的格式和 RUN指令格式一样, 分为 exec 格式和shell 格式.  
ENTRYPOINT的目的和 CMD一样,都是在指定容器启动程序及参数.ENTRYPOINT 在运行时也可以替代,不过比CMD要略显繁琐,需要通过 docker run 的参数 --entrypoint 来指定.  
当指定了 entrypoint 后,CMD 的含义就发生了改变,不再是直接的运行其命令,而是将CMD 的内容作为参数传给 entrypoint 指令, 换句话说实际执行时,将变为:　

```
<ENTRYPOINT> "<CMD>"
```
**4.5 ENV 设置环境变量**
格式有两种：　　
  - ENV <key> <value>
  - ENV <key>=<value> <key>=<value>

**4.6 ARG 构建参数**
格式:
  - ARG <参数名>[=<默认值>]

**4.7 VOLUME 定义匿名卷**
格式: 
  - VOLUME ["<路径1>", "<路径2>"...]
  - VOLUME <路径>

**4.8 EXPOSE 声明端口**
格式:
  - EXPOSE <端口1> [<端口2>...]

**4.9 WORKDIR 指定工作目录**
格式:
  - WORKDIR <工作目录路径>

**4.10 USER 指定当前用户**

**4.11 HEALTHCHECK 健康检查**
  - HEALTHCHECK [选项] CMD <命令> :　设置检查容器健康状况的命令
  - HEALTHCHECK NONE:　如果基础镜像有健康检查指令,使用这行可以屏蔽掉其健康检查命令指令

**4.12 ONBUILD 为他人做嫁衣裳**

### 5. Compose
>Compose 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。从功能上看，跟 OpenStack 中的 Heat 十分类似

Compose 中有两个重要的概念：  
  - 服务 (service)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。
  - 项目 (project)：由一组关联的应用容器组成的一个完整业务单元，在 docker-compose.yml 文件中定义。
  
#### 5.1 Compose 命令说明
**5.1.1 命令对象与格式**
对于 Compose 来说，大部分命令的对象既可以是项目本身，也可以指定为项目中的服务或者容器。如果没有特别的说明，命令对象将是项目，这意味着项目中所有的服务都会受到命令影响。

执行 `docker-compose [COMMAND] --help` 或者 `docker-compose help [COMMAND]` 可以查看具体某个命令的使用格式。

**5.1.2 命令使用说明**
1. build
2. config
  - 验证 Compose 文件格式是否正确，若正确则显示配置，若格式错误显示错误原因。
3. down
  - 此命令将会停止 up 命令所启动的容器，并移除网络
4. exec
  - 进入指定的容器。
5. help
  - 获得一个命令的帮助。
6. images
  - 列出 Compose 文件中包含的镜像。
7. kill
格式:
  - docker-compose kill [options] [SERVICE...]。

  通过发送 SIGKILL 信号来强制停止服务容器。
  支持通过 -s 参数来指定发送的信号，例如通过如下指令发送 SIGINT 信号。
8. logs
格式:
  - docker-compose logs [options] [SERVICE...]。

  查看服务容器的输出。默认情况下，docker-compose 将对不同的服务输出使用不同的颜色来区分。可以通过 --no-color 来关闭颜色。
选项：
  - --no-color 来关闭颜色

9. pause
格式:
  - docker-compose pause [SERVICE...]。

  暂停一个服务容器。
10. port
格式:
  - docker-compose port [options] SERVICE PRIVATE_PORT。

  打印某个容器端口所映射的公共端口。
选项：
  - --protocol=proto 指定端口协议，tcp（默认值）或者 udp。
  - --index=index 如果同一服务存在多个容器，指定命令对象容器的序号（默认为 1）。

11. ps
格式:
  - docker-compose ps [options] [SERVICE...]。

  列出项目中目前的所有容器。
选项：
  - q 只打印容器的 ID 信息。
12. pull
格式:
  - docker-compose pull [options] [SERVICE...]。

  拉取服务依赖的镜像。
选项：
  - --ignore-pull-failures 忽略拉取镜像过程中的错误。

13. push
  - 推送服务依赖的镜像到 Docker 镜像仓库。

14. restart
格式为 docker-compose restart [options] [SERVICE...]。

重启项目中的服务。

选项：

-t, --timeout TIMEOUT 指定重启前停止容器的超时（默认为 10 秒）。
15. rm
16. run
格式为 docker-compose run [options] [-p PORT...] [-e KEY=VAL...] SERVICE [COMMAND] [ARGS...]。

在指定服务上执行一个命令。
```
docker-compose run ubuntu ping docker.com
```
17. scale
18. start
19. stop
20. top
  - 查看各个服务容器内运行的进程
21. unpause
格式:
  - docker-compose unpause [SERVICE...]。

  恢复处于暂停状态中的服务。
22. up
  - 它将尝试自动完成包括构建镜像，（重新）创建服务，启动服务，并关联服务相关容器的一系列操作
  - -d 在后台运行服务容器。
  - 
  - --no-color 不使用颜色来区分不同的服务的控制台输出。
  - 
  - --no-deps 不启动服务所链接的容器。
  - 
  - --force-recreate 强制重新创建容器，不能与 --no-recreate 同时使用。
  - 
  - --no-recreate 如果容器已经存在了，则不重新创建，不能与 --force-recreate 同时使用。
  - 
  - --no-build 不自动构建缺失的服务镜像。
  - 
  - -t, --timeout TIMEOUT 停止容器时候的超时（默认为 10 秒）。
20. version
  - 打印版本信息