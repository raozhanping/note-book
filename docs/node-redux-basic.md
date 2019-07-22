## Redux

<img src="http://www.ruanyifeng.com/blogimg/asset/2016/bg2016091801.png" alt="redux logo">

### 基本用法

> React 只是 DOM 的一个抽象层，并不是 Web 应用的完整解决方案。他没有涉及 代码结构 和 组件之间的通信。  
对于大型的复杂应用来说，这两方面恰恰是最关键的。因此，只用  React 没法写大型应用。为了解决这个问题，2014年 Facebook 提出了 Flux 架构的概念，已发了很多的实现。  
2015年， Redux 出现，将 Flux 与函数式编程结合在一起，很短时间内就成为了最热门的前端架构。

首先明确一点， Redux 是一个很有用的架构，但不是费用不可。事实上，大多数情况，你可以不用它，只用 React 就够了。

以下这些情况不需要使用 Redux：  

* 用户的使用方式非常简单
- 用户之间没有协作
- 不需要与服务器大量交互，也没有使用 WebSocket
- 视图层 （View）只从单一来源获取数据

以下这些情况是 Redux 的适用场景：多交互、多数据源。  

- 用户的使用方式复杂
- 不同身份的用户有不同的使用方式（比如普通用户和管理员）
- 多个用户之间可以协作
- 与服务器大量交互，或者使用了 WebSocket
- View 要从多个来源获取数据

从组件角度出发，如果你的应用有以下场景，可以考虑使用 Redux。  
- 某个组件的状态，需要共享
- 某个状态需要在任何地方都可以拿到
- 一个组件需要改变全局状态
- 一个组件需要改变另一个组件的状态

#### 预备知识

[Redux 文档](http://redux.js.org/)  
Redux 视频[前30](https://egghead.io/courses/getting-started-with-redux)，[后30](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

#### 设计思想

1. Web 应用是一个状态机，视图与状态是一一对应的。
2. 所有的状体，保存在一个对象里面。

#### 基本概念和 API

1. **Store**

  Store 就是数据保存的地方，你可以把它看成一个容器。整个应用只能有一个 Store。 Redux 提供 createStore 这个函数，用来生成 Store。

  ```
  import { createStore } from 'redux';
  const store = createStore(fn);
  // createStore 函数接收另一个函数作为参数，返回新生成的 Store 对象
  ```

2. **State** 

  Store 对象班含所有数据。如果想得到某个时点的数据，就要对 Store 生成快照。这种时点的数据集合，就叫做 State。  

  ```
  import { createStore } from 'redux';
  const store = createStore(fn);

  const state = store.getState();
  // 当前时刻的 State ，可以通过 store.getState() 拿到
  ```
  Redux 规定，一个 State 对应一个 View。只要 State 相同， View 就相同。你知道 State，就知道 View 是什么样，反之亦然。

3. **Action** 

  State 的变化，会导致 View 的变化。但是，用户接触不到 State， 所有 State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。  

4. **Action Creator**

  View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦。可以定义一个函数来生成 Action,这个函数就叫 Action Creator。

  ```
  const ADD_TODO = '添加 TODO';

  function addTodo(text) {
    return {
      type: ADD_TODO,
      text
    }
  }

  const action = addTodo('Learn Redux');
  // addTodo 函数就是一个 Action Creator
  ```

5. **store.dispatch**

  Store.dispatch() 是 View 发出 Action 的唯一方法。

  ```
  import { createStore } from 'redux';

  const store = createStore(fn);

  store.dispatch({
    type: 'ADD_TODO',
    payload: 'Learn Redux'
  });
  // store.dispatch 接收一个 Action 对象作为参数，将它发送出去
  // 结合 Action Creator，改写代码

  store.dispatch(addTodo('Learn Redux'));

  ```

6. **Reduxcer**

  Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。  
  Reducer 是一个函数它接收 Action 和当前 State 作为参数，返回一个新的 State。  

  ```
  const reducer = function (state, action) {
    // ...
    return new_state;
  }
  ```

  整个应用的初始状态，可以作为 State 的默认值。  

  ```
  const defaultState = 0;
  const reducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'ADD':
        return state + action.payload;
      default:
        return state;
    }
  };

  const state = reducer(1, {
    type: 'ADD',
    payload: 2
  });
  ```

  实际应用中， Reducer 函数不用像上面这样手动调用，store.dispatch 方法会触发 Reducer 的自动执行。为此， Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入 createStore 方法。  
  
  ```
  import { createStore } from 'redux';
  const store = createStore(reducer);
  ```
  
  为什么这个函数叫做 Reducer 呢？因为他可以作为数组的 reduce 方法的参数。请看下面的例子，一系列 Action 对象按照顺序作为一个数组。

  ```
  const actions = [
    {type: 'ADD', payload: 0},
    {type: 'ADD', payload: 1},
    {type: 'ADD', payload: 2},
  ];

  const total = actions.reduce(reducer, 0);// 3
  ```

7. **纯函数**

  Reducer 函数最重要的特征是，他是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。  
  春函数是函数式编程，必须遵守以下一些约束。  

  - 不得改写参数
  - 不能调用系统 I/O 的 API
  - 不能调用 Date.now() 或者 Math.random() 等不纯的方法，因为每次会得到不一样的结果

  Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法：  

  ```
  // State 是一个对象
  function reducer(state, action) {
    return Object.assign({}, state, { thingToChange });
    // 或者
    return { ...state, ...newState };
  }

  // State 是一个数组
  function reducer(state, action) {
    return [...state, newItem];
  }
  ```

  某个 View 对应的 State 总是一个不变的对象。

8. **store.subscribe()**

  Store 允许使用 store.subscribe 方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

  ```
  import { createStore } from 'redux';
  const store = createStore(reducer);

  store.subscribe(listener);
  ```
  解除监听：store.subscribe 方法返回一个函数，调用这个函数就可以解除监听了。  

#### Store的实现

```
let store = createStore(todoApp, window.STATE_FROM_SERVER);

// window.STATE_FROM_SERVER就是整个应用的状态初始值。注意，如果提供了这个参数，他会覆盖 Reducer 函数的默认初始值。
```

下面是 createStore 方法的一个简单实现，可以了解一下 Store 是怎么生成的。

```
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const suvscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};
```

#### Reducer 的拆分

combineReducer 的简单实现：

```
const combineReducers = reducers => {
  return (state = {}, action) => {
    return Object.keys(Reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      }
    );
  }
};
```

