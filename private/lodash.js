import _ from 'lodash'
// Function
const afterFunc = () => {
    console.log('afterFunc')
}

console.log(_.after(1, afterFunc)())
