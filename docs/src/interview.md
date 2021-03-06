#  前端面试 

## 面试过程
1. 工作履历
2. 项目经验
3. 技术基础
4. 编程思路
5. 面试者问答

## 前端面试题

### html
1. doctype 作用? 严格模式与混杂模式如何区分？它们有何意义?
2. 列出常见的标签，并简单介绍这些标签用在什么场景？
3. 阐述下什么是块标签和内联标签，并写出5种块（block）标签，写出5种内联（inline）标签
4. 如何在 html 页面上展示 &lt;div&gt;&lt;/div&gt; 这几个字符？

### css
1. 阐述display分别为block, inline，inline-block的区别，(提示：在宽高、pading、margin上的区别）
2. 阐述visibility:hidden和display:none的区别
3. CSS选择器有哪些，举例写出如下选择器的实现方式
4. 伪类选择器有哪些?
5. 写出两种定宽div水平居中的方式(提示：margin和position方式)
6. CSS优先级算法如何计算？(提示：从!important注释，元素内部style属性，...class类等选择器角度去阐述）
7. 详细描述postion：absolute，fixed，relative，static的区别（提示：描述原点是怎么定位的）
8. 写出.clearfix 消除浮动的代码并阐述其原理
9. 如何让 Chrome 浏览器显示小于 12px 的文字？

### javascrit
1. 介绍js的基本数据类型
2. 描述”==“和“===”的区别
3. 在做if判断时，空字符串(‘’)，空对象(null)，空数组([])，undefined，哪些为true哪些为false
4. 写一段代码，分别使用call和apply向一个数组中添加一个元素
5. 简述什么是闭包，和闭包的应用场景
6. 阐述es6新特性有哪些
7. let, var, const 区别
8. 阐述下react 生命周期(提示： 从生命周期钩子函数解释)
9.  setState什么时候是同步，什么时候是异步的
10. 浏览器是如何渲染页面的？
11. 阐述下浏览器的事件循环机制

### 工程化
1. webpack 是如何打包文件的，或者阐述其基本配置有哪些分别有什么作用？
2. 常见的loader 和 plugin有哪些，他们的作用分别是什么？
3. 如何利用 webpack 来优化前端性能？

### 编程题
1. 实现一个方法，使得数组[1, 2, 3, 4, 5, 6, 7]能够乱序输出
2. 实现一个方法，对字符串'abbbcccccbb'压缩输出'a3b5c2b'
3. 实现对象的深拷贝
4. 编程使得 console.log(a == 1 && a == 2 && a == 3) 输出 true
5. 根据金额总数计算出最小货币数(count)

### 数据结构与算法
1. **有效的括号**  
    给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
2. **用两个栈实现队列**  
    用两个栈来实现一个队列，完成队列的 Push 和 Pop 操作。
3. **栈的压入、弹出序列**  
    输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如序列 1，2，3，4，5 是某栈的压入顺序，序列 4，5，3，2，1是该压栈序列对应的一个弹出序列，但4，3，5，1，2就不可能是该压栈序列的弹出序列。（注意：这两个序列的长度是相等的）
4. **包含 min 函数的栈**  
    定义栈的数据结构，请在该类型中实现一个能够得到栈最小元素的 min 函数。
