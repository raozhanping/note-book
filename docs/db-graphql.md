### GraphQL

### 概念解释

**1. Schema**  
schema 定义了 GraphQL API 系统的类型系统.他完整描述了客户端可以访问的所有数据(对象,成员变量,关系,人很类型).客户端的请求将根据schema进行校验和执行.客户端可以通过"自省"(introspection)获取关于schema的信息.schema存放于GraphQL API服务器.  

**2. Field**  
field是你可以从对象中获取的数据单元。正如GraphQL官方文档所说：“GraphQL查询语言本质上就是从对象中选择field”。  
关于field，官方标准中还说：  
所有的GraphQL操作必须指明到最底层的field，并且返回值为标量，以确保响应结果的结构明白无误

标量（scalar）：基本数据类型  
也就是说，如果你尝试返回一个不是标量的field，schema校验将会抛出错误。你必须添加嵌套的内部field直至所有的field都返回标量。  

**3. Argument**  
argument是附加在特定field后面的一组键值对。某些field会要求包含argument。mutation要求输入一个object作为argument。  

**4. Implementation**  
GraphQL schema可以使用implement定义对象继承于哪个接口。  

**5. Connection**  
connection让你能在同一个请求中查询关联的对象。通过connection，你只需要一个GraphQL请求就可以完成REST API中多个请求才能做的事。  

为帮助理解，可以想象这样一张图：很多点通过线连接。这些点就是node，这些线就是edge。connection定义node之间的关系。  

**6. Edge**  
edge表示node之间的connection。当你查询一个connection时，你通过edge到达node。每个edgesfield都有一个nodefield和一个cursorfield。cursor是用来分页的。  

**7. Node**  
node是对象的一个泛型。你可以直接查询一个node，也可以通过connection获取相关node。如果你指明的node不是返回标量，你必须在其中包含内部field直至所有的field都返回标量。  

### 基本使用

**1. 发现GraphQL API**  
GraphQL是可自省的，也就是说你可以通过查询一个GraphQL知道它自己的schema细节。  
- 查询__schema以列出所有该schema中定义的类型，并获取每一个的细节：
```
query {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
      }
    }
  }
}
```
- 查询__type以获取任意类型的细节：
```
query {
  __type(name: "Repository") {
    name
    kind
    description
    fields {
      name
    }
  }
}
```
> 提示：自省查询可能是你在GraphQL中唯一的GET请求。不管是query还是mutation，如果你要传递请求体，GraphQL请求方式都应该是POST  

**2. GraphQL 授权**  
要与GraphQL服务器通讯，你需要一个对应权限的OAuth token。  

通过命令行创建个人access token的步骤详见这里。你访问所需的权限具体由你请求哪些类型的数据决定。比如，选择User权限以获取用户数据。如果你需要获取版本库信息，选择合适的Repository权限。  

当某项资源需要特定权限时，API会通知你的。  

**3. GraphQL 端点**  
REST API v3有多个端点，GraphQL API v4则只有一个端点：  
```
https://api.github.com/graphql
```
不管你进行什么操作，端点都是保持固定的。  

**4. GraphQL 通讯**  
在REST中，HTTP动词决定执行何种操作。在GraphQL中，你需要提供一个JSON编码的请求体以告知你要执行query还是mutation，所以HTTP动词为POST。自省查询是一个例外，它只是一个对端点的简单的GET请求。  

**5. 关于 query 和 mutation 操作**  
在GitHub GraphQL API中有两种操作：query和mutation。将GraphQL类比为REST，query操作类似GET请求，mutation操作类似POST/PATCH/DELETE。mutation mame决定执行哪种改动。  

query和mutation具有类似的形式，但有一些重要的不同  

**6. 关于 query**  
GraphQL query只会返回你指定的data。为建立一个query，你需要指定“fields within fields"（或称嵌套内部field）直至你只返回标量。  

query的结构类似：  
```
query {
  JSON objects to return
}
```

**7. 关于 mutation**  
为建立一个mutation，你必须指定三样东西：  

1. mutation name：你想要执行的修改类型
2. input object：你想要传递给服务器的数据，由input field组成。把它作为argument传递给mutation name
3. payload object：你想要服务器返回给你的数据，由return field组成。把它作为mutation name的body传入

mutation的结构类似：
```
mutation {
  mutationName(input: {MutationNameInput!}) {
    MutationNamePayload
}
```
此示例中input object为MutationNameInput，payload object为MutationNamePayload.  

**8. 使用 variables**  
variables使得query更动态更强大，同时他能简化mutation input object的传值。  

以下是一个单值variables的示例：  
```
query($number_of_repos:Int!) {
  viewer {
    name
     repositories(last: $number_of_repos) {
       nodes {
         name
       }
     }
   }
}
variables {
   "number_of_repos": 3
}
```
使用variables分为三步：  
1. 在操作外通过一个variables对象定义变量：  
对象必须是有效的JSON。此示例中只有一个简单的Int变量类型，但实际中你可能会定义更复杂的变量类型，比如input object。你也可以定义多个变量。  

2. 将变量作为argument传入操作：
argument是一个键值对，键是$开头的变量名（比如$number_of_repos），值是类型（比如Int）。如果类型是必须的，添加!。如果你定义了多个变量，将它们以多参数的形式包括进来。  

3. 在操作中使用变量：
在此示例中，我们使用变量来代替获取版本库的数量。在第2步中我们指定了类型，因为GraphQL强制使用强类型。  

这一过程使得请求参数变得动态。现在我们可以简单的在variables对象中改变值而保持请求的其它部分不变。  

用变量作为argument使得你可以动态的更新variables中的值但却不用改变请求。  

### 示例案例

**1. query 示例**  
以下query查找octocat/Hellow-World版本库，找到最近关闭的20个issue，并返回每个issue的题目、URL、前5个标签：  
```
query {
  repository(owner:"octocat", name:"Hello-World") {
    issues(last:20, states:CLOSED) {
      edges {
        node {
          title
          url
          labels(first:5) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
}

```
让我们一行一行的来看各个部分：  

```
query {
```
因为我们想要从服务器读取而不是修改数据，所以根操作为query。（如果不指定一个操作，默认为query）  

```
repository(owner:"octocat", name:"Hello-World") {
```
为开始我们的query，我们希望找到repository对象。schema校验指示该对象需要owner和name参数  

```
issues(last:20, states:CLOSED) {
```
为计算该版本库的所有issue，我们请求issue对象。（我们可以请求某个repository中某个单独的issue，但这要求我们知道我所需返回issue的序号，并作为argument提供。）  

issue对象的一些细节：  
- 根据文档，该对象类型为IssueConnection
- schema校验指示该对象需要一个结果的last或first数值作为argument，所以我们提供20
- 文档还告诉我们该对象接受一个states argument，它是一个IssueState的枚举类型，接受OPEN或CLOSED值。为了只查找关闭的issue，我们给states键一个CLOSED值。

```
edges {
```
我们知道issues是一个connection，因为它的类型为IssueConnection。为获取单个issue的数据，我们需要通过edges取得node。  

```
node {
```
我们从edge的末端获取node。IssueConnection的文档指示IssueConnection类型末端的node是一个issue对象。  

既然我们知道了我们要获取一个Issue对象，我们可以查找文档并指定我们想要返回的field： 

```
title
url
labels(first:5) {
  edges {
    node {
      name
    }
  }
}
```
我们指定Issue对象的title，url，labels。  

labels field类型为LabelConnection。和issue对象一样，由于labels是一个connection，我们必须遍历它的edge以到达连接的node：label对象。在node上，我们可以指定我们想要返回的label对象field，在此例中为name。  

你可能注意到了在这个Octocat的公开版本库Hellow-World中运行这个query不会返回很多label。试着在你自己的有label的版本库中运行它，你就会看到差别了。  

**1. mutation 示例**  