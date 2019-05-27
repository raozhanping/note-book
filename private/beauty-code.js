var arr = [];
var arr1 = arr.map(function () {
    console.log(11);
    return null;
});
arr.forEach(function () {
    console.log(1);
});
console.log(arr1);
