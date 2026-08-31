//1.对象混入 合并A对象B对象 合并到一起
//2.类的混入 A类B类合并到一起

interface A {
    age:number
}

interface B {
    name:string
}

let a:A = {
    age:100
}

let b:B = {
    name:'zora'
}

//1. 扩展运算符 浅拷贝 返回新的类型
let c = {...a, ...b}
console.log(c)

//Object.assign 浅拷贝 返回交叉类型
let c2 = Object.assign({},a,b)
