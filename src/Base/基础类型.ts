// 变量名 : 类型
let notANumber: number = NaN;//Nan
let num: number = 123;//普通数字,浮点数也是可以的
let infinityNumber: number = Infinity;//无穷大
let decimal: number = 6;//十进制
let hex: number = 0xf00d;//十六进制
let binary: number = 0b1010;//二进制
let octal: number = 0o744;//八进制s
let str:string = 'Zora'
let n:null = null
let v1:void = undefined
let v2:undefined = undefined
//严格模式下 null 是 null, undefined 是 undefined

//函数没有返回值
function myFunc():void {
    return
    //void 不能return 任何值
}

console.log(str)

//any 类型可以给自己赋值
let a:any = []
a = 1
a = '123'
a = false

let b:number = 5
a = b
b = a

//unknow 不能给自己赋值，并且不能读取属性
let zora:unknown = {cool:true}
let a1:number = 5
zora = a1
// a1 = zora //无法赋值 unknown
//无法读取自身属性
// console.log(zora.cool)




