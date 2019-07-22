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

