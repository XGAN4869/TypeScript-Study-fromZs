"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//联合类型：同时支持两种类型 |
let phone = '1234567890';
function func1(type) {
    //强转换
    return !!type;
}
console.log(func1(0));
console.log(func1(true));
const zora = (a) => {
    console.log(a);
};
zora({
    name: 'Zora',
    age: 23,
    sex: 1
});
//类型断言 as 不能滥用会导致类型错误
// as any 放弃 ts 类型校验
/**
 *TODO as string
    强制类型转换（只是告诉TS “我确定它就是string”）,
    但也仅仅只是欺骗，并不能做到真实的转换
*/
//写法1
function func2(a) {
    console.log(a.length); //强制转换类型
}
func2('123'); //OK
func2(1) // 不能滥用会导致类型错误
(window).abc = '123';
//# sourceMappingURL=%E8%81%94%E5%90%88%E7%B1%BB%E5%9E%8B-%E7%B1%BB%E5%9E%8B%E6%96%AD%E8%A8%80-%E4%BA%A4%E5%8F%89%E7%B1%BB%E5%9E%8B.js.map