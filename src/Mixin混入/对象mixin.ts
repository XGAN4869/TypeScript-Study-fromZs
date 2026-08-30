//1.对象混入 合并A对象B对象 合并到一起
console.log('123')
interface A {
    age: number
}

interface B {
    name: string
}

let a:A = {
    age:18
}

let b:B = {
    name:'Zora'
}

//方式一：扩展运算符, 浅拷贝, 返回新类型
let c = {...a,...b}
console.log(c)


//Object.assign 浅拷贝, 交叉类型
let c2 = Object.assign({},a,b)
console.log(c2)

//区别，同名属性冲突后者会产生 never 类型， 前者是后面覆盖前面

console.log(structuredClone(a))