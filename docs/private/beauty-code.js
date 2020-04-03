const x = 20;
const f = n => n * 2;
const arr = Array.of(x);
const result = arr.map(f);
const log = console.log;
console.log(result);

// trace :: string -> a -> a
const trace = label => value => {
    console.log(`${ label }: ${ value }`);
    return value;
  };

const composeM = chainMethod => (...ms) => (ms.reduce((f, g) => x => g(x)[chainMethod](f)));
const label = 'API call composition';

const composePromises = composeM('then');

// getUserById :: number -> Promise
const getUserById = id => id === 3 ?
    Promise.resolve({ name: 'Kurt', role: 'Author' }) :
    undefined;

// hasPermission ::　object -> Promise
const hasPermission = ({ role }) =>　(Promise.resolve(role === 'Author'));

const authUser = composePromises(hasPermission, getUserById);

log(authUser(3).then(trace(label)));

// factorial :: Number -> Number
// function factorial(n) {
//     if (n === 1) {
//         return 1;
//     }
//     return n * factorial(n-1);
// }

// 尾递归
function factorial(n, total) {
    if (n === 1) {
        return total;
    }

    return factorial(n -1, n*total);
}

log(factorial(3, 1));

const 以 = { 单独: '单独1'}

const { 单独 } = 以

console.log(单独)

let dd = {0: 1, length: 1}
// console.log([...dd])

let sym = Symbol('name')
let symObj = { [sym]: 111 }
console.log(symObj)
console.log(sym in symObj)
for(let key in symObj) {
  console.log(key)
}


const mockFunc = {
  a: 1,
  call: function() {
    return '1111'
  }
}
console.log(typeof mockFunc)
