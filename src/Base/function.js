"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function func1(user) {
    return user;
}
//123
console.log(func1({ name: 'Zora', age: 23 }));
//函数重载reload -- 根据不同的参数决定不同的功能
let user = [1, 2, 3];
//实现函数
// 第一个变量 是 number | number[]
function findUser(params) {
    if (params && Array.isArray(params)) {
        user.push(...params);
        return user;
    }
    else if (params && typeof params === 'number') {
        return user.filter(i => i === params);
    }
    else {
        return user;
    }
}
console.log(findUser());
console.log(findUser(1));
console.log(findUser([4, 5]));
//# sourceMappingURL=function.js.map