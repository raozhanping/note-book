## Node

### assert 断言

> assert 模块提供了断言测试的函数，用于测试不变式。

1. **assert(value[,message])**  
  assert.ok()的别名。

2. **assert.deepEqual(actual, expected[, message])**  
  测试 actual 参数与 expected 参数是否深度相等。原始值使用相等运算符 (==) 比较。  

  只测试可枚举的自身属性，不测试对象的原型、连接符、或不可枚举的属性(这些情况使用 assert.deepStrictEqual())。

  ```
  // 不会跑出 AssertionError，因为 RegExp 对象的属性不是可枚举的
  assert.deepEqual(/a/gi, new Date());
  ```

  **Map** 和 **Set** 包含的自相也会被测试。
  子对象中可枚举的自身属性也会被测试： 
  
  ```
  const assert = require('assert');

  const obj1 = {
    a: {
      b: 1
    }
  };
  const obj2 = {
    a: {
      b: 2
    }
  };
  const obj3 = {
    a: {
      b: 1
    }
  };
  const obj4 = Object.create(obj1);

  assert.deepEqual(obj1, obj1);
  // 测试通过，对象与自身相等。

  assert.deepEqual(obj1, obj2);
  // 抛出 AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }
  // 因为 b 属性的值不同。

  assert.deepEqual(obj1, obj3);
  // 测试通过，两个对象相等。

  assert.deepEqual(obj1, obj4);
  // 抛出 AssertionError: { a: { b: 1 } } deepEqual {}
  // 因为不测试原型。
  ```

  如果两个值不相等，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息。  

3. **assert.deepStrictEqual(actual, expected[, message])**  

  与 assert.deepEqual() 大致相同，但是有一些区别：  
  - 原始值使用 全等运算符（===）比较。 Set 的值与 Map 的键使用 SameValueZero 比较。
  - 对象的原型也是用全等运算符 比较
  - 对象的类型标签要求相同
  - Object wrappers are compared both as objects and unwrapped values.

  ```
  const assert = require('assert');

  assert.deepEqual({ a: 1 }, { a: '1' });
  // 测试通过，因为 1 == '1'。

  assert.deepStrictEqual({ a: 1 }, { a: '1' });
  // 抛出 AssertionError: { a: 1 } deepStrictEqual { a: '1' }
  // 因为使用全等运算符 1 !== '1'。

  // 以下对象都没有自身属性。
  const date = new Date();
  const object = {};
  const fakeDate = {};

  Object.setPrototypeOf(fakeDate, Date.prototype);

  assert.deepEqual(object, fakeDate);
  // 测试通过，不测试原型。
  assert.deepStrictEqual(object, fakeDate);
  // 抛出 AssertionError: {} deepStrictEqual Date {}
  // 因为原型不同。

  assert.deepEqual(date, fakeDate);
  // 测试通过，不测试类型标签。
  assert.deepStrictEqual(date, fakeDate);
  // 抛出 AssertionError: 2017-03-11T14:25:31.849Z deepStrictEqual Date {}
  // 因为类型标签不同。

  assert.deepStrictEqual(new Number(1), new Number(2));
  // Fails because the wrapped number is unwrapped and compared as well.
  assert.deepStrictEqual(new String('foo'), Object('foo'));
  // OK because the object and the string are identical when unwrapped.
  ```

  如果两个值不相等，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息。  

4. **assert.doesNotThrow(block[, error][, message])**  

  断言 block 函数不会抛出错误。  
  当 assert.doesNotThrow() 被调用时，他会立即调用 block 函数。  
  如果抛出错误且错误类型与 error 参数指定的相同，则抛出 AssertionError。 如果错误类型不相同，或 error 参数为 undefined， 则抛出错误。  

5. **assert.fail(actual, expected[, message[, operator[,stackStartFunction]]])**  

  抛出 AssertionError  

6. **assert.ifError(value)**  
  如果 value 为真，则抛出 value。 可用于测试回调函数的 error 参数  

7. **assert.notDeepEqual(actual, expected[, message])**

8. **assert.ok(value[, message])**  

9. **assert.throws(block[, error][, message])**  
  断言 block 函数会抛出错误  

### 注意事项
  对于 SameValueZero 比较， 建议使用 ES2015 的 Object.is();

