# 代理(Proxy)和反射(Reflection)

- [代理(Proxy)和反射(Reflection)](#%e4%bb%a3%e7%90%86proxy%e5%92%8c%e5%8f%8d%e5%b0%84reflection)
  - [代理(Proxy)](#%e4%bb%a3%e7%90%86proxy)
    - [术语(term)](#%e6%9c%af%e8%af%adterm)
    - [语法(syntax)](#%e8%af%ad%e6%b3%95syntax)
      - [参数](#%e5%8f%82%e6%95%b0)
    - [方法(function)](#%e6%96%b9%e6%b3%95function)
    - [handler 对象的方法](#handler-%e5%af%b9%e8%b1%a1%e7%9a%84%e6%96%b9%e6%b3%95)
    - [示例(example)](#%e7%a4%ba%e4%be%8bexample)
  - [反射(Reflection)](#%e5%8f%8d%e5%b0%84reflection)
  - [引用](#%e5%bc%95%e7%94%a8)

## 代理(Proxy)
> Proxy 对象用于定义基本操作的自定义行为(如属性查找，赋值，枚举，函数调用等)

### 术语(term)
- handler  
包含陷阱（traps）的占位符对象。
- traps  
提供属性访问的方法。这类似于操作系统中捕获器的概念。
- target  
代理虚拟化的对象。它通常用作代理的存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）。

### 语法(syntax)
```js
let p = new Proxy(target, handler);
```
#### 参数
- target
  - Object | Array | Function | Proxy
  - 用Proxy包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
- handler
  - Object
  - 一个对象，其属性是当执行一个操作时定义代理的行为的函数。

### 方法(function)
- Proxy.revacable()  
创建一个可撤销的Proxy对象

### handler 对象的方法
handler 对象是一个占位符对象，它包含Proxy的捕获器。

### 示例(example)

## 反射(Reflection)

## 引用
- [MDN-Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
