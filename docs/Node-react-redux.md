## Redux

### React-Redux 的用法

#### UI组件

- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用this.state这个变量）
- 所有数据都由参数（this.props）提供
- 不使用任何 Redux 的 API

#### 容器组件

- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 API

#### connect()

React-Redux 提供 connect 方法， 用于从 UI 组件生成容器组件。 connect 的意思，就是将这两种组件连起来。  

```
import { connect } from 'react-redux';
const VisibleTodoList = connect()(TodoList);
```
为了定义业务逻辑需要给出下面的信息：  

- 输入逻辑：外部的数据（即state对象）如何转换为 UI 组件的参数
- 输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。

因此， connect 方法的完整 API 如下：  

```
import { connect } from 'react-redux';

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
```
connect 方法接受两个参数： mapStateToProps 和mapDispatchToProps 。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将state映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。  


#### Provider 组件