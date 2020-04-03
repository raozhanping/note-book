# 类型转换
> js 中的那些隐式转换和强制转换

## 数据类型
### 类型介绍
1. Number
2. Boolean
3. String
4. Undefined
5. Null
6. Object
7. Symbol(es6定义的)

### typeof 返回值
1. number
2. boolean
3. string
4. object
5. undefined
6. object
7. function
8. symbol

## 强制转换
> 通过String(), Number(), Boolean()函数强制转换
1. parseInt() -> 转换到第一个不是数字为止，一个都没有返回 NAN

## 隐式转换
### 规则
1. 转换成 String 
   - + 字符串连接符
2. 转换成 Number
   - 自增/自减运算符(++|--)
   - 算术运算符(+-*/)
   - 关系运算符(>|<|>=|<=|==|!=)
3. 转成 Boolean

### 常见的隐式转换
#### 基本类型
1. 注意字符串连接符与算数运算符的区别
   - 字符串连接符： 只要+号两边存在字符串
   - 算术运算符+： 两边都是数字
2. 关系运算符会把其他数据类型转换成Number之后比较
   - 两边都是字符串时，按照字符串对应的unicode编码转成数字比较
   - 两边都是字符串，且字符串是多个字符时。从左往右依次比较
3. 

### Object类型
1. 先转成String，然后再转成Number
   - 先用 valueOf() 方法获取其原始值，如果原始值不是Number类型，则用toString() 方法转成String
   - 再将String转成Number运算

2. Array.prototype.toString.call([]) === ''
3. Object.prototype.toString.call({}) === '[object Object]'
