//构造函数Foo
function Foo() {
    this.a = 1;
}
console.log(Foo.prototype);
//修改原型，如果没有正确维护constructor属性，导致其指向Object
Foo.prototype = {
    aa:10,
    bb:function(){
        console.log(20);
    },
    constructor:Foo
}
//创建实例foo
var foo = new Foo();
console.log(foo.aa);
//自身属性绑定了a:1
//通过原型继承的方式拿到原型属性
console.log('foo',foo);
// console.log('foo.prototype',foo.prototype); // 没有这个属性
console.log('true',foo.__proto__ === Foo.prototype);
console.log(Foo.prototype);
//[[Prototype]] 是一个内部属性，表示对象的原型链继承关系
// 这是每个 JavaScript 对象都有的隐藏属性，指向它的原型对象（即它的"父对象"）

console.log(Foo.prototype.constructor === Foo);
console.log(Foo.prototype.constructor);