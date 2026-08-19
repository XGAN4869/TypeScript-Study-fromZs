/**
 * Options接口：约束new Vue({ ... })传入的配置对象有哪些字段、什么类型
 * el: '#app' | el: document.getElementById('app')!
*/
interface Options {
    el:string | HTMLElement
}

// VueClass接口：用来约束 class Vue 这个类必须具备哪些属性、哪些方法
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
//虚拟 DOM 简单版
class Dom {
    //创建节点方法
    createElement(el:string){
        return document.createElement(el)
    }
    //填充文本方法
    setText(el:HTMLElement,text:string | null){
        el.textContent = text
    }
    //渲染函数：为了让子类能够调取父类的 render 方法
    render(data:Vnode){
        let root = this.createElement(data.tag)
        if(data.children && Array.isArray(data.children)){
            data.children.forEach(item=>{
                //递归不停地渲染有child 的节点
                let child = this.render(item)
                root.appendChild(child)
            })
        }else{
            //无 child,填充文本
            this.setText(root,data.text)
        }

        return root //FIXME 返回之后好像有递归的操作？
    }
}
// class Vue implements VueCls
// TODO implements：用于约束 class 类的 || 虽然我记得在 java 中是实现
class Vue extends Dom implements VueClass{
    options:Options;
    constructor(options:Options) {
        //FIXME ? 好像如果写了 extends 就要写 super？
        super()
        this.options = options;
    }
    init():void {
        //虚拟 dom 就是通过 js 去渲染真实 Dom
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
                }
             ]
        }
        //由于联合类型？所以要判断一下，不然会滥用
        let app = typeof this.options.el === 'string' ? document.querySelector(this.options.el) : (this.options.el)
        //把真实的 Dom 节点塞进去即可
        app.appendChild(this.render(data))
    }
}

// new Vue，传入配置对象，el:"#app"( 就是告诉Vue挂载到id=app的div )
//TODO 然后底下的这个 el:xxx 就是 options
const vm = new Vue({
    el:'#app',
});

// 手动调用初始化，模拟Vue内部自动执行init