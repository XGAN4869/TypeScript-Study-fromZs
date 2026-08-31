//原型链顶端是 Object，等于啥都可以
//TODO: note 这里是大写
let a:Object = 123

//小写 object, 不支持原始类型，支持引用类型
// let a1:object = 123
// let a2:object = '123'
// let a3:object = false
let a4:object = []            //✔️
let a5:object = {}            //✔️
let a6:object = ()=>{}  //✔️
