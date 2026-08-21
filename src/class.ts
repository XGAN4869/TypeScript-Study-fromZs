/**
 * 源码版
 * instance.update()
 *     ↓
 * effect.run()
 *     ↓
 * componentUpdateFn()
 *     ↓
 * renderComponentRoot()
 *     ↓
 * patch(null, VNode)
 *     ↓
 * 真实 DOM
*/
/**
 * 简易版：模拟的是“首次挂载”的核心部分
 * vm.init()
 *     ↓
 * this.render(data)
 *     ↓
 * createElement()
 *     ↓
 * 递归 render()
 *     ↓
 * setText()
 *     ↓
 * appendChild()
 *     ↓
 * 返回真实 DOM
*/


interface Options {
    el:string | HTMLElement
}

//TODO VueClass接口：用来约束 class Vue 这个类必须具备哪些属性、哪些方法
interface VueClass {
    options:Options;
    init():void;
}

// TODO extends: 继承
interface Vnode {
    tag:string //div section header
    text?:string //输入的文字
    children?:Vnode[] //子集？这里有递归的意味
}
//TODO 虚拟 DOM 简单版 -- Vue 的父类(将挂载方法放 Dom 中是因为这些方法是"浏览器 DOM"，不是 Vue 配置本身)
class Dom {

    //super 原理，可以子类 super('Zora')
    // constructor(name?:string){
    //     console.log(name)
    // }

    //创建节点方法
    private createElement(el:string){
        return document.createElement(el)
    }
    //填充文本方法
    setText(el:HTMLElement,text:string | null){
        el.textContent = text
    }
    /**
     * 简化版 patch / mountElement递归把 VNode 变成真实 DOM
    */
    render(data:Vnode){
        //root: 把虚拟节点data（VNode）的tag，在内存中创建出真实 DOM 元素，作为这一棵子 DOM 树的根节点
        let root = this.createElement(data.tag) //【A】内存里新建的DOM节点，还不在页面
        if(data.children && Array.isArray(data.children)){
            data.children.forEach(item=>{
                //递归不停地渲染有child 的节点
                //最接近 patch(null, subTree)它直接把 VNode 转成 DOM
                let child = this.render(item)
                root.appendChild(child)
            })
        }else{
            //无 child,填充文本
            if(data.text !== undefined){
                this.setText(root, data.text)
            }
        }

        return root // 返回这一整颗拼好的DOM子树（依旧在内存）
    }
}
// class Vue implements VueCls
//Dom：负责“怎么操作真实 DOM” | Vue：负责“什么时候调用这些操作”
// TODO implements：用于约束 class 类的 || 虽然我记得在 java 中是实现
class Vue extends Dom implements VueClass{
    options:Options;
    constructor(options:Options) {
        //FIXME 如果写了 extends 就要写 super
        super() //父类的 prototype.constructor.call()
        this.options = options;
    }
    //static 静态方法，没有加 static 相互之间无法调用
    // static xxx(){}
    // static version():number {
    //     this.xxx // this 只能指向 static, 调用不了 init
    //     return 666
    // }

    init():void {
        //虚拟 dom 就是通过 js 去渲染真实 Dom
        //真实的 Vnode 是 render 执行后出来的
        let data:Vnode = {
            tag:'div',
            children:[
                {
                    tag:'section',
                    text:'我是子节点1'
                },
                {
                    tag:'section',
                    text:'我是子节点2'
                },
                {
                    tag:'section',
                    children:[
                        {
                            tag:'section',
                            text:'我是zizi节点3'
                        },
                    ]
                }
             ]
        }
        //由于联合类型？所以要判断一下，不然会滥用
        //拿到根节点
        let app = typeof this.options.el === 'string' ? document.querySelector(this.options.el) : (this.options.el)
        //把真实的 Dom 节点塞进去即可
        // 如果选择器没有找到元素，提前给出明确错误
        if (!app) {
            throw new Error(`没有找到挂载元素：${this.options.el}`)
        }
        // 递归创建真实 DOM
        app.appendChild(this.render(data))
    }
}

// new Vue，传入配置对象，el:"#app"( 就是告诉Vue挂载到id=app的div )
//TODO 然后底下的这个 el:xxx 就是 options
const vm = new Vue({
    el:'#app',
});

// 手动调用初始化，模拟Vue内部自动执行init
vm.init();

// //不使用new 使用实例本身的方法是静态方法
// console.log(Vue.version());
