"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//虚拟 DOM 简单版 -- Vue 的父类
class Dom {
    //super 原理，可以子类 super('Zora')
    // constructor(name?:string){
    //     console.log(name)
    // }
    //创建节点方法
    createElement(el) {
        return document.createElement(el);
    }
    //填充文本方法
    setText(el, text) {
        el.textContent = text;
    }
    //渲染函数：为了让子类能够调取父类的 render 方法
    render(data) {
        let root = this.createElement(data.tag);
        if (data.children && Array.isArray(data.children)) {
            data.children.forEach(item => {
                //递归不停地渲染有child 的节点
                let child = this.render(item);
                root.appendChild(child);
            });
        }
        else {
            //无 child,填充文本
            if (data.text !== undefined) {
                this.setText(root, data.text);
            }
        }
        return root; //FIXME 返回之后好像有递归的操作？
    }
}
// class Vue implements VueCls
// TODO implements：用于约束 class 类的 || 虽然我记得在 java 中是实现
class Vue extends Dom {
    options;
    constructor(options) {
        //FIXME 如果写了 extends 就要写 super
        super(); //父类的 prototype.constructor.call()
        this.options = options;
    }
    //static 静态方法，没有加 static 相互之间无法调用
    // static xxx(){}
    // static version():number {
    //     this.xxx // this 只能指向 static, 调用不了 init
    //     return 666
    // }
    init() {
        //虚拟 dom 就是通过 js 去渲染真实 Dom
        let data = {
            tag: 'div',
            children: [
                {
                    tag: 'section',
                    text: '我是子节点1'
                },
                {
                    tag: 'section',
                    text: '我是子节点2'
                },
                {
                    tag: 'section',
                    children: [
                        {
                            tag: 'section',
                            text: '我是zizi节点3'
                        },
                    ]
                }
            ]
        };
        //由于联合类型？所以要判断一下，不然会滥用
        let app = typeof this.options.el === 'string' ? document.querySelector(this.options.el) : (this.options.el);
        //把真实的 Dom 节点塞进去即可
        // 如果选择器没有找到元素，提前给出明确错误
        if (!app) {
            throw new Error(`没有找到挂载元素：${this.options.el}`);
        }
        app.appendChild(this.render(data));
    }
}
// new Vue，传入配置对象，el:"#app"( 就是告诉Vue挂载到id=app的div )
//TODO 然后底下的这个 el:xxx 就是 options
const vm = new Vue({
    el: '#app',
});
// 手动调用初始化，模拟Vue内部自动执行init
vm.init();
// //不使用new 使用实例本身的方法是静态方法
// console.log(Vue.version());
//# sourceMappingURL=class.js.map