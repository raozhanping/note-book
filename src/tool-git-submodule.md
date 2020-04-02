# Git Submodule
> 翻译自 git docs

## Name
git-submodule - Initialize, update or inspect submodules  
git submodule 命令可以初始化、更新、和检查 git 子模块  

## Synopsis
```shell
git submodule [--quiet] [--cached]
git submodule [--quiet] add [\<options\>] [--] \<repository\> [\<path\>]
git submodule [--quiet] status [--cached] [--recursive] [--] [\<path\>…​]
git submodule [--quiet] init [--] [\<path\>…​]
git submodule [--quiet] deinit [-f|--force] (--all|[--] \<path\>…​)
git submodule [--quiet] update [\<options\>] [--] [\<path\>…​]
git submodule [--quiet] set-branch [\<options\>] [--] \<path\>
git submodule [--quiet] summary [\<options\>] [--] [\<path\>…​]
git submodule [--quiet] foreach [--recursive] \<command\>
git submodule [--quiet] sync [--recursive] [--] [\<path\>…​]
git submodule [--quiet] absorbgitdirs [--] [\<path\>…​]
```

## Description
Inspects, updates and manages submodules  
