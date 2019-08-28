## Redux

### 中间件与异步操作

- Reducer：纯函数，只承担计算 State 的功能，不合适承担其他功能，也承担不了，因为理论上，纯函数不能进行读写操作。
- View：与 State 一一对应，可以看作 State 的视觉层，也不合适承担其他功能。
- Action：存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。

#### 中间件的用法

```
import { applyMiddlerware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = creteLogger();

const store = createStore(
  reducer, applyMiddleware(logger)
);
```

注意：  

1. createStore 方法可以接受整个应用的初始状态作为参数，那样的话， applyMiddleware 就是第三个参数了。
2. 中间件的次序有讲究。

#### applyMiddlewares()

```
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };

    chain = middlewares.map(middleware => middleware(middlerwareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return { ...store, dispatch }
  }
}
```

所有中间件被放进了一个数组chain，然后嵌套执行，最后执行store.dispatch。可以看到，中间件内部（middlewareAPI）可以拿到getState和dispatch这两个方法。  

#### 异步操作的基本思路

1. redux-thunk
2. redux-promise