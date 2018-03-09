# Introduction

### unbuntu 中管理用户和用户组

1. 添加一个用户并指定 id 为1002  
  sudo groupadd -g 1002 www

2. 添加一个用户到 www 组并指定 id 为 1003
  sudo useradd wyx -g 1002 -u 1003 -m

3. 修改用户密码
  sudo passwd wyx

4. 删除一个用户
  sudo userdel wyx

5. 为该用户添加 sudo 权限
  sudo usermod -a -G adm wyx
  sudo usermod -a -G sudo wyx
  
6. 查看所有用户和用户组：
  cat /etc/passwd
  cat /etc/group

### TODO:
1. async await 是否阻塞問題?
2. 