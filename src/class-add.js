"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ref {
    _value; //还没学泛型，按理说有多种类型都可以
    constructor(value) {
        this._value = value;
    }
    //✅ 行为完全就是 get /set 访问器设计出来的效果，不是 bug。👇🔗
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get
    get value() {
        return this._value + '拦截get';
    }
    set value(newValue) {
        this._value = newValue + '拦截set\n';
    }
}
const ref = new Ref('666\n');
//读取值操作被 get 方法拦截了
console.log(ref.value); //✅ 调用 get value()
ref.value = '我要改了\n';
console.log(ref.value);
//# sourceMappingURL=class-add.js.map