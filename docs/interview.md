#  前端面试 

## 面试过程
1. 工作履历
2. 项目经验
3. 技术基础
4. 编程思路
5. 面试者问答

## 前端面试题

### html
1. Doctype作用？标准模式与兼容模式各有什么区别?
2. 写出5种块（block）标签，写出5种内联（inline）标签

### css
1. 阐述display分别为block, inline，inline-block的区别，(提示：在宽高、pading、margin上的区别）
2. 阐述visibility:hidden和display:none的区别
3. CSS选择器有哪些，举例写出如下选择器的实现方式
    1.id选择器 例：#tableId                                                                                                       
    2.类选择器
    3.标签选择器
    4.相邻选择器
    5.子选择器
    6.后代选择器
    7.通配符选择器
    8.属性选择器
    9.伪类选择器
4. 写出两种定宽div水平居中的方式（提示：margin和position方式）
```html
<body>
    <div style="width:800px; margin:0 auto;">
        centered content
    </div>
</body>
```

5. CSS优先级算法如何计算？(提示：从!important注释，元素内部style属性，tag样式，.class类选择器、js文件加载顺序角度去阐述）
6. 简述css定义的权重如何计算
7. 详细描述postion：absolute，fixed，relative，static的区别（提示：描述原点是怎么定位的）
8. 写出.clear消除浮动的代码和其原理

### javascrit
1. 介绍js的基本数据类型               
2. 描述”==“和“===”的区别
3. 在做if判断时，空字符串(‘’)，空对象(null)，空数组([])，undefined，哪些为true哪些为false
4. 写一段代码，分别使用call和apply向一个数组中添加一个元素
5. 简述什么是闭包，和闭包的应用场景
6. 时间轴的做法
