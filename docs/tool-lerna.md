#  Lerna 
## 模式
- Fixed/Locked mode (default)
  - 在publish的时候,会在lerna.json文件里面"version": "0.1.5",,依据这个号，进行增加，只选择一次，其他有改动的包自动更新版本号
- Independent mode
  - lerna init --independent初始化项目。 lerna.json文件里面"version": "independent",
  - 每次publish时，您都将得到一个提示符，提示每个已更改的包，以指定是补丁、次要更改、主要更改还是自定义更改

## Lerna Script

### lerna create [loc]
> 创建一个包，name包名，loc 位置可选
```bash
# 根目录的package.json 
 "workspaces": [
    "packages/*",
    "packages/@gp0320/*"
  ],
  
# 创建一个包gpnote默认放在 workspaces[0]所指位置
lerna create gpnote 

# 创建一个包gpnote指定放在 packages/@gp0320文件夹下，注意必须在workspaces先写入packages/@gp0320，看上面
lerna create gpnote packages/@gp0320
```

### lerna add [@version] [--dev] [--exact]
> 增加本地或者远程package做为当前项目packages里面的依赖
```node
# Adds the module-1 package to the packages in the 'prefix-' prefixed folders
lerna add module-1 packages/prefix-*

# Install module-1 to module-2
lerna add module-1 --scope=module-2

# Install module-1 to module-2 in devDependencies
lerna add module-1 --scope=module-2 --dev

# Install module-1 in all modules except module-1
lerna add module-1

# Install babel-core in all modules
lerna add babel-core

```

### lerna bootstrap
> 默认是npm i

### lerna list
> 列出所有的包，如果与你文夹里面的不符，进入那个包运行yarn init -y解决

### lerna import
> 导入本地已经存在的包

### lerna run
```node
lerna run < script > -- [..args] # 运行所有包里面的有这个script的命令
$ lerna run --scope my-component test
```

### lerna exec
```node
$ lerna exec -- < command > [..args] # runs the command in all packages
$ lerna exec -- rm -rf ./node_modules
$ lerna exec -- protractor conf.js
lerna exec --scope my-component -- ls -la
```

### lerna link
> 项目包建立软链，类似npm link

### lerna clean
> 删除所有包的node_modules目录

### lerna changed
> 列出下次发版lerna publish 要更新的包

原理： 需要先git add,git commit 提交。 然后内部会运行git diff --name-only v版本号，搜集改动的包，就是下次要发布的。并不是网上人说的所有包都是同一个版全发布  

### lerna publish
> 会打tag，上传git,上传npm。 如果你的包名是带scope的例如："name": "@gp0320/gpwebpack", 那需要在packages.json添加

```json
 "publishConfig": {
    "access": "public"
  },
```
## reference
- [Lerna 中文教程详解](https://juejin.im/post/5ced1609e51d455d850d3a6c)
- 