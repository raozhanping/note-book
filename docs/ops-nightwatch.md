# nightwatch
> nightwatch.js是一个web-ui自动化测试框架

- [ 所需环境 ](#所需环境)
- [ 项目配置 ](#项目配置)
- [ 注意 ](#注意)
- [ API Reference ](#api-reference)
- [ 引文 ](#引文)

## 所需环境

```javascript
npm intall nightwatch -D

// selenium-server是基于Java开发的，作用是用来连接浏览器的
npm install selenium-server -D

// 浏览器驱动器
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedrive -D
```

## 项目配置

```javascript
module.exports = {
    'src_folders': [
        'e2e/case'
    ],
    'output_folder': 'reports',
    'custom_commands_path': '',
    'custom_assertions_path': '',
    'page_objects_path': '',
    'globals_path': require('./e2e/config/global.config').path,
    'selenium': {
        'start_process': true,
        'server_path': require('selenium-server').path,
        'log_path': '',
        'host': '127.0.0.1',
        'port': 4444,
        'cli_args': {
            'webdriver.chrome.driver': require('chromedriver').path
        }
    },
    'test_settings': {
        'default': {
            'launch_url': 'http://localhost',
            'selenium_port': 4444,
            'selenium_host': 'localhost',
            'silent': true,
            'screenshots': {
                'enabled': false,
                'path': ''
            },
            'desiredCapabilities': {
                'browserName': 'chrome',
                'marionette': true
            }
        },
        'chrome': {
            'desiredCapabilities': {
                'browserName': 'chrome'
            }
        },
        'edge': {
            'desiredCapabilities': {
                'browserName': 'MicrosoftEdge'
            }
        }
    }
}
```

* src_folders：表示的就是case所在的文件夹
* output_folder：代表的是报告输出的文件夹
* selenium下面的server_path：代表的是selenium-server的安装路径
* selenium下面的start_process：代表的是是否自动启动selenium——server,入股设为false,不会自动启动server。
* cli_args下面的driver表示几个driver的安装路径，分别安装成功就可以了
* test_settings是传给nightwatch实例的数据，这里面可以配置多个环境，default是必须有的，其他环境可以自行配制。

## 注意
1. 在windows发现报错了，运行不起来的。我们需要在package.json下面配置一下
2. API 中 selector  --->  CSS / Xpath
3. cssSelector      --->  CSS

## API Reference
### Expect
Nightwatch provides a fluent BDD-style interface for performing assertions on elements, defined on the expect namespace on the main Nightwatch instance(Nightwatch提供了一个流畅的BDD风格的界面，用于对元素进行断言，在主要的Nightwatch实例上的expect命名空间中定义)   

```javascript
this.demoTest = function (browser) {
    // start with identifying the element
    // and then assert the element is present
    browser.expect.element('#main').to.be.present;

    // or assert the element is visible
    browser.expect.element('#main').to.be.visible;
};
```
#### Language Chains
- to
- be
- been
- is
- that
- which
- and
- has
- have
- with
- at
- does
- of

#### .equal(value)/.contain(value)/.match(regex)
These methods will perform assertions on the specified target on the current element. The targets can be an attribute value, the element's inner text and a css property(这些方法将在当前元素的指定目标上执行断言。目标可以是属性值，元素的内部文本和css属性)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').text.to.equal('The Night Watch');
    browser.expect.element('#main').text.to.contain('The Night Watch');
    browser.expect.element('#main').to.have.css('display').which.equals('block');
};
```

#### .startsWith(value)/.endsWith(value)

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').text.to.endWith('Watch');

    browser.expect.element('#main').text.to.startWith('The');
};
```

#### .not

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').text.to.not.equal('The Night Watch');

    browser.expect.element('#main').text.to.not.contain('The Night Watch');

    browser.expect.element('#main').to.have.css('display').which.does.not.equal('block');
};
```

#### .before(ms)/.after(ms)
These methods perform the same thing which is essentially retrying the assertion for the given amount of time (in milliseconds). before or after can be chained to any assertion and thus adding retry capability(这些方法执行相同的操作，基本上是在给定的时间量（以毫秒为单位）重试断言。之前或之后可以链接到任何断言，从而添加重试功能)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').text.to.contain('The Night Watch').before(1000);

    browser.expect.element('#main').text.to.not.contain('The Night Watch').after(500);
};

```

#### .a(type [, message])

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#q').to.be.an('input');
    browser.expect.element('#q').to.be.an('input', 'Testing if #q is an input');
    browser.expect.element('#w').to.be.a('span');
}

```

#### .attribute(name [, message])

```javascript
this.demoTest = function (browser) {
    browser.expect.element('body').to.have.attribute('data-attr');
    browser.expect.element('body').to.not.have.attribute('data-attr');
    browser.expect.element('body').to.not.have.attribute('data-attr', 'Testing if body does not have data-attr');
    browser.expect.element('body').to.have.attribute('data-attr').before(100);
    browser.expect.element('body').to.have.attribute('data-attr')
        .equals('some attribute');
    browser.expect.element('body').to.have.attribute('data-attr')
        .not.equals('other attribute');
    browser.expect.element('body').to.have.attribute('data-attr')
        .which.contains('something');
    browser.expect.element('body').to.have.attribute('data-attr')
        .which.matches(/^something\ else/);
};
```

#### .css(property [, message])

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').to.have.css('display');
    browser.expect.element('#main').to.have.css('display', 'Testing for display');
    browser.expect.element('#main').to.not.have.css('display');
    browser.expect.element('#main').to.have.css('display').before(100);
    browser.expect.element('#main').to.have.css('display').which.equals('block');
    browser.expect.element('#main').to.have.css('display').which.contains('some value');
    browser.expect.element('#main').to.have.css('display').which.matches(/some\ value/);
};

```

#### .enabled
Property that checks if an element is currently enabled.(检查当前是否启用了元素的属)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#weblogin').to.be.enabled;
    browser.expect.element('#main').to.not.be.enabled;
    browser.expect.element('#main').to.be.enabled.before(100);
};
```

#### .present
Property that checks if an element is present in the DOM.(检查DOM中是否存在元素的属性)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').to.be.present;
    browser.expect.element('#main').to.not.be.present;
    browser.expect.element('#main').to.be.present.before(100);
};
```

#### .selected
Property that checks if an OPTION element, or an INPUT element of type checkbox or radio button is currently selected.(检查当前是否选中OPTION元素或类型为复选框或单选按钮的INPUT元素的属性。)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').to.be.selected;
    browser.expect.element('#main').to.not.be.selected;
    browser.expect.element('#main').to.be.selected.before(100);
};

```

#### .text

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').text.to.equal('The Night Watch');
    browser.expect.element('#main').text.to.not.equal('The Night Watch');
    browser.expect.element('#main').text.to.equal('The Night Watch').before(100);
    browser.expect.element('#main').text.to.contain('The Night Watch');
    browser.expect.element('#main').text.to.match(/The\ Night\ Watch/);
};

```

#### .value
Property that retrieves the value (i.e. the value attributed) of an element. Can be chained to check if contains/equals/matches the specified text or regex(检索元素的值（即属性值）的属性。可以链接以检查是否包含/ equals /匹配指定的文本或正则表达式)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#q').to.have.value.that.equals('search');
    browser.expect.element('#q').to.have.value.not.equals('search');
    browser.expect.element('#q').to.have.value.which.contains('search');
    browser.expect.element('#q').to.have.value.which.matches(/search/);
};

```

#### .visible
Property that asserts the visibility of a specified element.(断言指定元素可见性的属性。)  

```javascript
this.demoTest = function (browser) {
    browser.expect.element('#main').to.be.visible;
    browser.expect.element('#main').to.not.be.visible;
    browser.expect.element('#main').to.be.visible.before(100);
};

```

### Assert
- .assert
    when an assertion fails, the test ends, skipping all other assertions.(当断言失败时，测试结束，跳过所有其他断言)  
- .verify
    when an assertion fails, the test logs the failure and continues with other assertions.(当断言失败时，测试记录失败并继续其他断言)  

```javascript
client.assert.visible('.non_existing');

client.verify.visible(".non_existing");
```

1. **Node.js Assert Module**
    Nightwatch.js extends Node.js assert module, so you can also use any of the available methods there in your tests.(Nightwatch.js扩展了Node.js断言模块，因此您还可以在测试中使用任何可用的方法。)  

2. **Automatically retrying failed assertions**
    setting the property retryAssertionTimeout (in milliseconds) in the globals file.  
    Example: retryAssertionTimeout = 2000  

#### .attributeContains(String selector, String attribute, String expected [, String message])
Checks if the given attribute of an element contains the expected value.(检查元素的给定属性是否包含期望值)  
- selector  CSS / Xpath

```javascript
this.demoTest = function (browser) {

    browser.assert.attributeContains('#someElement', 'href', 'google.com');

};

```

#### .attributeEquals(String cssSelector, String attribute, String expected [, String msg])
Checks if the given attribute of an element has the expected value.(检查元素的给定属性是否具有期望值)  
- cssSelector  CSS

```javascript
this.demoTest = function (browser) {

    browser.assert.attributeEquals("body", "data-attr", "some value");

};

```

#### .containsText(String cssSelector, String expectedText [, String msg])
Checks if the given element contains the specified text.()  

```javascript
this.demoTest = function (browser) {

    browser.assert.containsText("#main", "The Night Watch");

};

```

#### .cssClassPresent(String cssSelector, String className [, String msg])
Checks if the given element has the specified CSS class.(检查给定元素是否具有指定的CSS类)  

```javascript
this.demoTest = function (browser) {

    browser.assert.cssClassPresent("#main", "container");

};
```

#### .cssClassNotPresent(String cssSelector, String  className [, String msg])
Checks if the given element does not have the specified CSS class.(检查给定元素是否没有指定的CSS类)  

```javascript
this.demoTest = function (browser) {

    browser.assert.cssClassNotPresent("#main", "container");

};
```

#### .cssProperty(cssSelector, cssProperty, expected [, msg])
Checks if the specified css property of a given element has the expected value.(检查给定元素的指定css属性是否具有期望值)  

```javascript
this.demoTest = function (browser) {

    browser.assert.cssProperty("#main", "display", "block");

};
```

#### .elementPresent(cssSelector [, msg])
Checks if the given element exists in the DOM(检查DOM中是否存在给定元素)  

```javascript
this.demoTest = function (browser) {

    browser.assert.elementPresent("#main");

};
```

#### .elementNotPresent(cssSelector [, msg])
Checks if the given element does not exist in the DOM.(检查DOM中是否存在给定元素)  

```javascript
this.demoTest = function (browser) {

    browser.assert.elementNotPresent(".should_not_exist");

};
```

#### .hidden(cssSelector [, msg])
Checks if the given element is not visible on the page.(检查给定元素是否在页面上不可见)  

```javascript
this.demoTest = function (browser) {

    browser.assert.hidden(".should_not_be_visible");

};
```

#### .title(expected [, msg])
Checks if the page title equals the given value.(检查页面标题是否等于给定值)  

```javascript
this.demoTest = function (browser) {

    browser.assert.title("Nightwatch.js");

};

```

#### .urlContains(expectedText [, msg])
Checks if the current URL contains the given value.(检查当前URL是否包含给定值)  

```javascript
this.demoTest = function (browser) {

    browser.assert.urlContains('google');

};
```

#### .urlEquals(expected [, msg])

```javascript
this.demoTest = function (browser) {

    browser.assert.urlEquals('http://www.google.com');

};
```

#### .value(cssSelector, expectedText [, msg])
Checks if the given form element's value equals the expected value.(检查给定表单元素的值是否等于预期值)

```javascript
this.demoTest = function (browser) {

    browser.assert.value("form.login input[type=text]", "username");

};
```

#### .valueContains(cssSelector, expectedText [, msg])
Checks if the given form element's value contains the expected value.(检查给定表单元素的值是否包含期望值)  

```javascript
this.demoTest = function (browser) {

    browser.assert.valueContains("form.login input[type=text]", "username");

};

```

#### .visible(cssSelector [, msg])
Checks if the given element is visible on the page.(检查给定元素是否在页面上可见)  

```javascript
this.demoTest = function (browser) {

    browser.assert.visible(".should_be_visible");

};
```

### Page Object API
> Page objects provide an additional layer of abstraction for test case creation(页面对象为测试用例创建提供了额外的抽象层)

```javascript
module.exports = {
    // can be string or function
    url: function () {
        return this.api.launchUrl;
    },

    elements: {
        // shorthand, specifies selector
        mySubmitButton: 'input[type=submit]'

        // full
        myTextInput: {
        selector: 'input[type=text]',
        locateStrategy: 'css selector'
        }
    },

    commands: [
        {
        myCustomPause: function () {
            this.api.pause(this.props.myPauseTime);
        }
        }
    ],

    // object version (best considered immutable)
    props: {
        myPauseTime: 1000
    },

    sections: {

    myFooterSection: {

        selector: '#my-footer',
        locateStrategy: 'css selector',

        elements: {
            myLogo: {
            selector: '.my-logo',
            locateStrategy: 'css selector'
            }
        },

        commands: [
            {
                myMoveToLogo: function () {
                    this.moveToElement('@myLogo', this.props.myLogoX, this.props.myLogoY);
                }
            }
        ],

        // function version (recommended)
        props: function () {
            return {
                myLogoX: 10,
                myLogoY: 10
            };
        },

        sections: {
            // additional, nested sections
        }
        }
    }
};

```

#### Page Object Module(页面对象模块)

|Name   | Type  |  description  |
| ---- | ---- | ---- |  
|commands   | Array  |  A list of objects containing functions to represent methods added to the page object instance  |
|commands   | Array  |  包含函数的对象列表，用于表示添加到页面对象实例的方法  |
| elements | Object/Array | An object, or array of objects, of named element definitions to be used as element selectors within element commands called from the page object|
| elements | Object/Array | 命名元素定义的对象或对象数组，用作从页面对象调用的元素命令中的元素选择器|
| props | Object/Function | An object or a function returning an object representing a container for user variables. Props objects are copied directly into the props property of the page object instance.|
| props | Object/Function | 返回表示用户变量容器的对象的对象或函数。 Props对象被直接复制到页面对象实例的props属性中|
| sections | Object | An object of named sections definitions defining the sections within the page object.|
| sections | Object | 命名节定义的对象，用于定义页面对象中的节|
| url | String/Function | A url or function returning a url to be used in a url() command when the page's navigate() method is called. |
| url | String/Function | 调用页面的navigate（）方法时返回url（）命令中使用的url或函数的url或函数 |

#### Page Object Instance
页面对象模块定义用于在调用标准命令API的页面引用中的各自工厂函数时定义页面对象实例

```javascript
const myPageObject = browser.page.MyPage(); // defined in MyPage.js module
```

##### Properties
| Name | Type | description |
| ---   | ---   | ---   |
| api | Object | 提供对完整Nightwatch命令API的访问的参考，通常在测试用例中称为浏览器。这用于访问那些不属于页面对象API中命令子集的命令 |
| elements | Object | 元素选择器使用的Element对象的映射 |
| name | Object | 页面对象的名称由其模块名称定义（不包括扩展名）。这与用于从命令API中的页面引用访问页面对象工厂的名称相同 |
| props | Object | 对从模块定义分配的props对象的引用 |
| section | Object | 为页面对象定义的Sections对象的映射。这将只包含页面对象模块的根节定义中的节。嵌套部分可通过其父部分自己的部分参考来访问 |
| url | String\Function | 来自页面对象模块的url值，可以是字符串，也可以是函数，具体取决于它在那里的定义方式 |

##### Methods
###### .navigate()
使用命令API的url（）命令导航到为页面对象定义的已解析URL,在处理页面对象时，通常使用此命令代替命令API的url（），因为页面对象的url成员是用户定义的url字符串或函数，而不是用于导航到url的调用

#### Element Instances
元素实例封装用于处理元素选择器的定义,通常，您不需要直接访问它们，而是使用@ -prefixed名称来引用它们，但是它们可以通过页面对象或节的元素属性获得

#### Section Instances
页面对象部分实例是从页面对象实例的section属性访问的（请注意，这是“section”的单数形式，而复数版本“sections”在模块定义中使用）,节通过页面对象工厂自动创建，可直接作为节参考中的属性使用

```javascript
const myPageObject = browser.page.MyPage();
const mySection = myPageObject.section.MySection; // from a `sections: {}` block in page object
        
```

#### Page Object Commands
> All the Nightwatch command and assertions API is inherited by page objects(所有Nightwatch命令和断言API都由页面对象继承)

#### Custom Commands
| Name | Type | description |
|--- | --- | --- |
| commands | Array | 包含函数的对象列表，用于表示添加到页面对象实例的方法 |

页面对象命令注意事项:
- Access(访问)  
    页面对象命令在页面对象模块中定义。它们可以位于命令列表中的模块根对象中，也可以位于节定义内（也可以位于命令中），但仅存在于它们所在的定义中  
    模块根命令中的页面对象命令在子节中不可用，并且节命令在父节或根页对象中不可用  
- Context(上下文)  
    页面对象命令上下文（this的值）是页面对象（对于节对象的节对象）  
- Execution(执行)  
    不从命令队列中调用页面对象命令。调用函数时，会立即执行页面对象命令中的代码  
- Chaining(链接)  
    页面对象命令必须返回链接值。这可以是任何东西，但建议您坚持这一点，以允许您的命令在页面对象实例的上下文中链接  

### Commands



## 引文
- [官网nightwatch](http://nightwatchjs.org/guide)
- [关于Nightwatch](http://www.cnblogs.com/saryli/p/6170201.html)
- [selenium download](http://selenium-release.storage.googleapis.com/index.html)
