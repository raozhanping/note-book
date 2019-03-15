# Git

## 具体规则
```javascript
<type>(<scope>): <subject>
```

### type
    用于说明 commit 的类别，只允许使用下面7个标识  

```javascript
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```
### scope
    用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同  

### subject
    是 commit 目的的简短描述，不超过50个字符  
> 以动词开头，使用第一人称现在时，比如change，而不是changed或changes  
第一个字母小写  
结尾不加句号(.)  


## 项目中使用
> Node 插件 validate-commit-msg ,检查项目中 Commit message 是否规范

### 使用方式
1. 建立 .vcmrc 文件:

```javascript
{ 
    "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"], 
    "scope": { 
        "required": false, 
        "allowed": ["*"], 
        "validate": false, 
        "multiple": false 
    }, 
    "warnOnFail": false, 
    "maxSubjectLength": 100, 
    "subjectPattern": ".+", 
    "subjectPatternErrorMsg": "subject does not match subject pattern!", 
    "helpMessage": "", 
    "autoFix": false 
} 
```

2. 写入 package.json

```javascript
{ 
    "config": { 
        "validate-commit-msg": { 
        /* your config here */ 
        } 
    } 
}
```

3. 自动使用 ghooks 钩子函数
> TODO: 详解

```javascript
{ 
    … 
    "config": { 
        "ghooks": { 
            "pre-commit": "gulp lint", 
            "commit-msg": "validate-commit-msg", 
            "pre-push": "make test", 
            "post-merge": "npm install", 
            "post-rewrite": "npm install", 
            … 
        } 
    } 
    … 
}
```

## Commit 规范的作用
1. 提供更多的信息，方便排查与回退;
2. 过滤关键字，迅速定位;
3. 方便生成文档;

## 生成 Change log
生成的文档包括以下三个部分:  
1. New features
2. Bug fixes
3. Breaking changes.

使用工具 Conventional Changelog 生成 Change log ：  
```shell
npm install -g conventional-changelog 
cd jartto-domo 
conventional-changelog -p angular -i CHANGELOG.md -w
```