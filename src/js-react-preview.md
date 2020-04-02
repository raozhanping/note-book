# React热身
> 用于构建用户界面的 JavaScript 库

## 组件
### 示例组件
1. props
2. propTypes
3. state
4. ReactDOM.render
5. this.props.children

```jsx
import React, { Component } from 'react';
import propTypes from 'prop-types';

class TestComponent extends React.Component {
    static defaultProps = {
        name: 'testing component',
        count: 1
    }
    static propTypes = {
        name: propTypes.string.isRequired
    }
    constructor() {
        this.state = {
            name: '',
            count: 1
        };
    }
    // 16.3 deprecated
    componentWilMount() {
        console.log('初始化阶段1');
    }
    static getDerivedStateFromProps(nextProps, preState) {
        console.log('初始化阶段1')
    }
    componentDidMount() {
        console.log('初始化阶段2');
    }
    componentWillUnmount() {
        console.log('卸载阶段1');
    }
    // 16.3 deprecated
    componentWillReceiveProps(nextProps) {
        console.log('运行阶段1');
    }
    shouldComponentUpdate(newProps, newState) {
        console.log('运行阶段2');
        if (!newProps.name) {
            return false;
        }
    }
    // 16.3 deprecated
    componentWillUpdate(nextProps, nextState) {
        console.log('运行阶段3');
    }
    getSnapshotBeforeUpdate(preProps, preState) {
        console.log('更新阶段')
    }
    componentDidUpdate(preProps, preState) {
        console.log('运行阶段4');
    }

    handleClick() {
        console.log('react click 事件处理');
    }

    render() {
        console.log('组件渲染了');

        return (
            <section id="demo">
                <h1>
                    Hello {this.props.name}
                </h1>
                <p onClick={handleClick}>测试点击事件</p>
            </section>
        );
    }
}

ReactDOM.render(
  <TestComponent name="Taylor" />,
  document.getElementById('root')
);
```

### 组件生命周期函数
> 分三个阶段： 初始化（挂载）阶段、运行（更新）阶段、卸载阶段  

- React
  - componentWillMount
  - componentDidMount
  - componentWillReceiveProps
  - shouldComponentUpdate
  - componentWillUpdate
  - componentDidUpdate
  - componentWillUnmount

![react 生命周期 v16之前](/static/images/react_life_cycle_before16.jpg)  

- React v16.0
  - componentDidCatch(error, info) 此生命周期在后代组件抛出错误后被调用
- React v16.3
  - static getDerivedStateFromProps
  - getSnapshotBeforeUpdate

![react 生命周期 v16.4](/static/images/react_16_life_cycle.jpeg)  

- React v17.0
  - ~~componentWillReceiveProps~~
  - ~~componentWillMount~~
  - ~~componentWillUpdate~~

### 概念
#### 受控组件
> 表单数据是由 React 组件来管理  
  
```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

#### 非受控组件
> 表单数据将交由 DOM 节点来处理  

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```
#### 状态提升
> 状态共享

#### 无状态组件
#### 有状态组件
#### 高阶组件(HOC)
> 高阶组件是参数为组件，返回值为新组件的函数

### React哲学
1. 将设计好的 UI 划分为组件层级(单一功能原则)
2. 用 React 创建一个静态版本
3. 确定 UI state 的最小（且完整）表示
4. 确定 state 放置的位置
5. 添加反向数据流

### Create React App
[Docs](https://facebook.github.io/create-react-app/docs/getting-started)

### reference
- [reactjs](https://zh-hans.reactjs.org/)
