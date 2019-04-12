# React
- [React](#react)
  - [类型验证(prop-types)](#%E7%B1%BB%E5%9E%8B%E9%AA%8C%E8%AF%81prop-types)
  - [React V16.7.0-alpha Hooks](#react-v1670-alpha-hooks)
    - [Rules of Hooks](#rules-of-hooks)
  - [虚拟 DOM 和 DOM Diff](#%E8%99%9A%E6%8B%9F-dom-%E5%92%8C-dom-diff)
    - [虚拟DOM](#%E8%99%9A%E6%8B%9Fdom)
    - [实现一下虚拟DOM](#%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%8B%E8%99%9A%E6%8B%9Fdom)
    - [渲染虚拟DOM](#%E6%B8%B2%E6%9F%93%E8%99%9A%E6%8B%9Fdom)
    - [DOM-diff闪亮登场](#dom-diff%E9%97%AA%E4%BA%AE%E7%99%BB%E5%9C%BA)
    - [patch补丁更新](#patch%E8%A1%A5%E4%B8%81%E6%9B%B4%E6%96%B0)
  - [package](#package)
  - [参考文献](#%E5%8F%82%E8%80%83%E6%96%87%E7%8C%AE)

## 类型验证(prop-types)
```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // 你可以将属性声明为以下 JS 原生类型
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 任何可被渲染的元素（包括数字、字符串、子元素或数组）。
  optionalNode: PropTypes.node,

  // 一个 React 元素
  optionalElement: PropTypes.element,

  // 你也可以声明属性为某个类的实例，这里使用 JS 的
  // instanceof 操作符实现。
  optionalMessage: PropTypes.instanceOf(Message),

  // 你也可以限制你的属性值是某个特定值之一
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 限制它为列举类型之一的对象
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 一个指定元素类型的数组
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 一个指定类型的对象
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 一个指定属性及其类型的对象
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // 你也可以在任何 PropTypes 属性后面加上 `isRequired` 
  // 后缀，这样如果这个属性父组件没有提供时，会打印警告信息
  requiredFunc: PropTypes.func.isRequired,

  // 任意类型的数据
  requiredAny: PropTypes.any.isRequired,

  // 你也可以指定一个自定义验证器。它应该在验证失败时返回
  // 一个 Error 对象而不是 `console.warn` 或抛出异常。
  // 不过在 `oneOfType` 中它不起作用。
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // 不过你可以提供一个自定义的 `arrayOf` 或 `objectOf` 
  // 验证器，它应该在验证失败时返回一个 Error 对象。 它被用
  // 于验证数组或对象的每个值。验证器前两个参数的第一个是数组
  // 或对象本身，第二个是它们对应的键。
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

## React V16.7.0-alpha Hooks
### Rules of Hooks
- 只能在顶层调用Hooks 。不要在循环，条件或嵌套函数中调用Hook
- 只能在functional component中使用

## 虚拟 DOM 和 DOM Diff
### 虚拟DOM
> 用 JS 去按照 DOM 结构来实现的树形结构对象，你也可以叫做 DOM 对象

### 实现一下虚拟DOM
```Javascript
// element.js

// 虚拟DOM元素的类，构建实例对象，用来描述DOM
class Element {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }
}

// 创建虚拟DOM，返回虚拟节点(object)
function createElement(type, props, children) {
    return new Element(type, props, children);
}


export {
    Element,
    createElement
}
```

**参数分析：**  
- type: 指定元素的标签类型，如'li', 'div', 'a'等
- props: 表示指定元素身上的属性，如class, style, 自定义属性等
- children: 表示指定元素是否有子节点，参数以数组的形式传入

### 渲染虚拟DOM
```Javascript
// element.js
class Element {
    // 省略
}

function createElement() {
    // 省略
}

// render方法可以将虚拟DOM转化成真实DOM
function render(domObj) {
    // 根据type类型来创建对应的元素
    let el = document.createElement(domObj.type);

    // 再去遍历props属性对象，然后给创建的元素el设置属性
    for (let key in domObj.props) {
        // 设置属性的方法
        setAttr(el, key, domObj.props[key]);
    }

    // 遍历子节点
    // 如果是虚拟DOM，就继续递归渲染
    // 不是就代表是文本节点，直接创建
    domObj.children.forEach(child => {
        child = (child instanceof Element) ? render(child) : document.createTextNode(child);
        // 添加到对应元素内
        el.appendChild(child);
    });

    return el;
}

// 设置属性
function setAttr(node, key, value) {
    switch(key) {
        case 'value':
            // node是一个input或者textarea就直接设置其value即可
            if (node.tagName.toLowerCase() === 'input' ||
                node.tagName.toLowerCase() === 'textarea') {
                node.value = value;
            } else {
                node.setAttribute(key, value);
            }
            break;
        case 'style':
            // 直接赋值行内样式
            node.style.cssText = value;
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}

// 将元素插入到页面内
function renderDom(el, target) {
    target.appendChild(el);
}


export {
    Element,
    createElement,
    render,
    setAttr,
    renderDom
};
```

### DOM-diff闪亮登场
> 说到DOM-diff那一定要清楚其存在的意义，给定任意两棵树，采用先序深度优先遍历的算法找到最少的转换步骤
> 作用： 根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁用来更新DOM

```Javascript
// diff.js
function diff(oldTree, newTree) {
    // 声明变量patches用来存放补丁的对象
    let patches = {};
    // 第一次比较应该是树的第0个索引
    let index = 0;
    // 递归树 比较后的结果放到补丁里
    walk(oldTree, newTree, index, patches);

    return patches;
}

function walk(oldNode, newNode, index, patches) {
    // 每个元素都有一个补丁
    let current = [];

    if (!newNode) { // rule1
        current.push({ type: 'REMOVE', index });
    } else if (isString(oldNode) && isString(newNode)) {
        // 判断文本是否一致
        if (oldNode !== newNode) {
            current.push({ type: 'TEXT', text: newNode });
        }
    } else if (oldNode.type === newNode.type) {
        // 比较属性是否有更改
        let attr = diffAttr(oldNode.props, newNode.props);
        if (Object.keys(attr).length > 0) {
            current.push({ type: 'ATTR', attr });
        }
        // 如果有子节点，遍历子节点
        diffChildren(oldNode.children, newNode.children, patches);
    } else { // 说明节点被替换了
        current.push({ type: 'REPLACE', newNode});
    }

    // 当前元素确实有补丁存在
    if (current.length) {
        // 将元素和补丁对应起来，放到大补丁包中
        patches[index] = current;
    }
}

function isString(obj) {
    return typeof obj === 'string';
}

function diffAttr(oldAttrs, newAttrs) {
    let patch = {};
    // 判断老的属性中和新的属性的关系
    for (let key in oldAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            patch[key] = newAttrs[key]; // 有可能还是undefined
        }
    }
    for (let key in newAttrs) {
        // 老节点没有新节点的属性
        if (!oldAttrs.hasOwnProperty(key)) {
            patch[key] = newAttrs[key];
        }
    }

    return patch;
}

// 所有都基于一个序号来实现
let num = 0;
function diffChildren(oldChildren, newChildren, patches) {
    // 比较老的第一个和新的第一个
    oldChildren.forEach((child, index) => {
        walk(child, newChildren[index], ++num, patches);
    });
}


// 默认导出
export default diff;
```

**比较规则**  
- 新的DOM节点不存在{type: 'REMOVE', index}
- 文本的变化{type: 'TEXT', text: 1}
- 当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包{type: 'ATTR', attr: {class: 'list-group'}}
- 节点类型不相同，直接采用替换模式{type: 'REPLACE', newNode}

### patch补丁更新
```Javascript
import {
    Element,
    render,
    setAttr
} from './element';

let allPatches;
let index = 0; // 默认哪个需要打补丁

function patch(node, patches) {
    allPatches = patches;
    // 给某个元素打补丁
    walk(node);
}

function walk(node) {
    let current = allPatches[index++];
    let childNodes = node.childNodes;
    // 先序深度，继续遍历递归子节点
    childNodes.forEach(child => walk(child));

    if (current) {
        doPatch(node, current); // 打上补丁
    }
}

function doPatch(node, patches) {
    // 遍历所有打过的补丁
    patches.forEach(patch => {
        switch (patch.type) {
            case 'ATTR':
                for (let key in patch.attr) {
                    let value = patch.attr[key];
                    if (value) {
                        setAttr(node, key, value);
                    } else {
                        node.removeAttribute(key);
                    }
                }
                break;
            case 'TEXT':
                node.textContent = patch.text;
                break;
            case 'REPLACE':
                let newNode = patch.newNode;
                newNode = (newNode instanceof Element) ? render(newNode) : document.createTextNode(newNode);
                node.parentNode.replaceChild(newNode, node);
                break;
            case 'REMOVE':
                node.parentNode.removeChild(node);
                break;
            default:
                break;
        }
    });
}

export default patch;
```

**patch做了什么？**  
- 用一个变量来得到传递过来的所有补丁allPatches
- patch方法接收两个参数(node, patches)
- 在方法内部调用walk方法，给某个元素打上补丁
- walk方法里获取所有的子节点
- 给子节点也进行先序深度优先遍历，递归walk
- 如果当前的补丁是存在的，那么就对其打补丁(doPatch)
- doPatch打补丁方法会根据传递的patches进行遍历
- 判断补丁的类型来进行不同的操作:
  1. 属性ATTR for in去遍历attrs对象，当前的key值如果存在，就直接设置属性setAttr； 如果不存在对应的key值那就直接删除这个key键的属性
  2. 文字TEXT 直接将补丁的text赋值给node节点的textContent即可
  3. 替换REPLACE 新节点替换老节点，需要先判断新节点是不是Element的实例，是的话调用render方法渲染新节点；不是的话就表明新节点是个文本节点，直接创建一个文本节点就OK了。之后再通过调用父级parentNode的replaceChild方法替换为新的节点
  4. 删除REMOVE 直接调用父级的removeChild方法删除该节点


## package
- mirrorx

## 参考文献
1. [让虚拟DOM和DOM-diff不再成为你的绊脚石](https://mp.weixin.qq.com/s?__biz=MzA5NzkwNDk3MQ==&mid=2650589435&idx=1&sn=75005051cea090a2cda4b4a8aecb26a7&pass_ticket=JIeTs7T5OIBuudopj7hpG6ejn7QCYos7b5sPJ4jlWsDGiKGuPkt2uuIpI8GcaIIi)
