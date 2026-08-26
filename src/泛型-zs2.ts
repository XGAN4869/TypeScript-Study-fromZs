
/**
 *  TODO T 可以 extends 约束类型
 *      但是 约束类型最好是自定义的 interface/type
*/

//如果 :number 写成 :T, 那 T 可以是数字字面量类型 1，返回值规定1就不对了
function add<T extends number>(a:T,b:T){
    return a + b;
}
//有 length 属性
interface Len {
    length: number;
}

function fn<T extends Len>(a:T){
    a.length
}
fn("123")
// fn(123)
fn([1,2,3])

let obj = {
    name:'ZORA',
    age:23,
}

//拿到 obj 的属性
type key = keyof typeof obj

function ob<T extends object,K extends keyof T>(obj: T,key:K){
    return obj[key]
}

interface Data {
    name: string
    age: number
}

//用 for in 循环操作给某 interface 接口上一些限制
type Options<T extends Data> = {
   readonly [key in keyof T]: T[key]
}
type B = Options<Data>;

