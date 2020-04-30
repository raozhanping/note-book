# node 如何调用 dll

## dll介绍
	DLL(Dynamic Link Library)文件为动态链接库文件，又称"应用程序拓展"，是软件文件类型。在Windows中，许多应用程序并不是一个完整的可执行文件，它们被分割成一些相对独立的动态链接库，即DLL文件，放置于系统中。当我们执行某一个程序时，相应的DLL文件就会被调用。

## 调用方式
1. 使用 ffi 模块调用 （提示：github仓库近2年没有维护动态）
2. 使用 addon ，用 LoadLibrary 加载 dll

###  使用 ffi 的方式

```js
var ffi = require('ffi');
var ref = require('ref');
var refStruct = require('ref-struct');
var refArray  = require('ref-array');

// 定义结构体
var configClass = refStruct({
	param1:ref.types.int,
	param2:ref.types.int
});

var strClass = refStruct({
	arr:refArray(ref.types.char, 100),
});

// 映射 dll 中的方法
var DLL = ffi.Library('testdll.dll',{
	'doStrings':['string',[ref.refType(strClass)]],
	'doString':['string',[ref.refType(strsClass)]],
	'doResult':['int',[ref.refType(resClass)]],
	'doTest':['int',[ref.refType(configClass)]],
	'doParam':['int',[ref.refType(paramClass)]],
	'doStruct':['string',[ref.refType(ref.refType(ref.types.void)), ref.refType(structClass)]]
});

// 引用
var config = new configClass();
config.param1 = 3;
config.param2 = 5;

var res = DLL.doTest(config.ref());
```

