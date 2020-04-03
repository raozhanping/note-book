## Nunjucks

### 模板

#### 文件扩展名
- 任意扩展名来命名 Nunjucks 模板文件（建议 .njk）；

#### 变量
- undefined 或 null 不显示；

#### 过滤器

#### 模板继承
- 模板继承可以达到模板复用的效果，同时支持多层继承；
- 可以将继承的模板设为一个变量，这样可以动态指定继承的模板；这个变量既可以是个指向模板文件的字符串也可以是个模板编译后所生成的对象（需要添加上下文环境）。

#### super
- 通过调用 super 从而父级区块中的内容渲染到子区块中。

#### 标签
- if
- for
```js
  <h1>Posts</h1>
  <ul>
  {% for item in items %}
    <li>{{ item.title }}</li>
  {% else %}
    <li>This would display if the 'item' collection were empty</li>
  {% endfor %}
  </ul>
  // 如果 items 数组是空数组的话则会渲染 else 语句中的内容
```
在循环中可获取一些特殊的变量：  
  - loop.index
  - loop.index0
  - loop.revindex
  - loop.revindex0
  - loop.first
  - loop.last
  - loop.length

- asyncEach  
  asyncEach 为 for 的异步版本，只有当使用自定义异步模板加载器的时候才使用。
- asyncAll  
  asyncAll 和 asyncEach 类似，但 asyncAll 会并行的执行，并且每项的顺序仍然会保留。除非使用异步的过滤器、扩展或加载器，否则不要使用。  
- macro  
宏（macro） 可以定义可复用的内容，类似于编程语言中的函数.

```html
  {% macro field(name, value='', type='test') %}
    <div class="field">
      <input type="{{ type }}" name="{{ name }}" value="{{ value | escape }}"/>
    </div>
  {% endmacro %}
```
- set

```js
  {% set standardModal %}
    {% include 'standardModalData.html' %}
  {% endset %}
```
- extends  
  extends 用来指定模板继承，被指定的模板为父级模板
- block  
  区块（block）定义了模板片段并标示一个名字，在模板继承中使用。父级模板可指定一个区块，子模板覆盖这个区块。
- include  
  include 可以引入其他的模板，可以再多模板之间共享一些小模板，如果某个模板已使用了继承那么 include 将会非常有用。  
  在某些情况下，我们可能希望在模板文件不存在时不要抛弃异常。对于这些情况，我们可以使用 ignore missing 来略过这些异常：

```js
{% include 'missing.html' ignore missing %}
```

- import  
 import 可加载不同的模板，可是你操作模板输出的数据，模板将会输出宏和在顶级作用域进行的赋值。  
 被 import 进来的模板没有``当前模板的上下文``，所以无法使用当前模板的变量。
- raw  
 输出一些 Nunjucks 特殊的标签，可以使用 {% raw %}将所有的内容输出为纯文本。
- filter  
 filter 区块允许我们使用区块中的内容来调用过滤器。不同于使用 | 语法，他会将区块渲染处的内容传递给过滤器。
- call  
 call 区块允许你使用标签之间的内容来调用一个宏。这在你需要给宏传入大量内容时是十分有用的。在宏中，你可以通过caller() 来获取这些内容。

#### 关键字参数
#### 注释
 {# and... #}
#### 空白字符控制
你可以在开始和结束区块添加（-）来去除前面和后面的空白字符。
#### 表达式
你可以使用和 javascript 一样的字面量
#### 运算
Nunjucks 支持运算
#### 比较
#### Logic
- and
- or
- not
- 可以使用大括号来分组
#### If 表达式
和 javascript 的三元运算符一样，可使用if 的内联表达式
#### 函数调用（function Calls）
#### 自定义转义
#### 全局函数
- range([start], stop, [step])
- cycler(item1, item2, ...itemN)
- joiner([separator])
#### 内置过滤器
- default(value, default, [boolean])
- sort(arr, reverse, caseSens, attr)
- striptags(value, [preserve_linebreaks])
- dump(object)
