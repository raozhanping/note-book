## chai.js 断言库

> BDD风格的expect/should API，  
> TDD 风格的Assert API

### BDD

expect 和 should 是 BDD 风格的，二者使用相同的链式语言来组织断言，但不同于他们初始化断言的方式：expect 使用构造函数来创建断言对象实例，而should通过为Object.protorype新增方法来实现断言（所以should 不支持 IE）；expect 直接指向 chai.expect ,而 should 则是chai.should().  

### 语言链
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
- of
- same

### .not
对之后的断言取反  

```js
expect(foo).to.not.equal('bar');
expect(goodFn).to.not.throw(Error);
expect({ foo: 'baz' }).to.have.property('foo').and.not.equal('bar');
```
### .deep

