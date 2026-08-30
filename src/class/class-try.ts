
//定义挂载节点的入参规则(使用场景一般是在 params 形参处)
interface Options {
    el:HTMLElement | string
}

//定义 Vue 这个类本身的结构契约(使用场景是约束 class 类)
interface VueCls {
    options:Options
    init():void
}

//定义 Vnode 参数的结构
interface Vnode {
    tag:string
    text?:string
    children?:Vnode[]
}

//虚拟 Dom, 负责“怎么操作真实 DOM” 虚拟VNode -> 浏览器真实DOM的转换，模拟mountElement逻辑
class Dom {

    // 创建真实DOM元素
    createElement(el:string) {
        return document.createElement(el)
    }
    // 设置元素文本内容, 这里的 el 不再是字符串，是已经创建好的 DOM 节点对象
    setText(el: HTMLElement,text:string) {
        el.textContent = text
    }
    /**
     * render 简易版 mountElement，把VNode转换成真实DOM节点
     * @param data 虚拟节点 Vnode
     * @returns 生成完成的真实HTMLElement节点
     */
    render(data:Vnode){
        let root = document.createElement(data.tag)
        //有子节点
        if(data.children && Array.isArray(data.children)){
            data.children.forEach(item=>{
                let child = this.render(item)
                root.appendChild(child)
            })
        }else{
            //没有,填充文字
            if(data.text !== undefined){
                this.setText(root,data.text)
            }
        }
        return root
    }

}

// Vue 类的实现: 负责“什么时候调用这些操作”
class Vue extends Dom implements VueCls {
    options:Options
    constructor(options:Options) {
        super();
        this.options = options;
    }
    //init()内部
    init():void{
        let data:Vnode = {
            tag:"div",
            children:[
                {
                    tag:"section",
                    text:"我是子节点1"
                },
                {
                    tag:"section",
                    text:"我是子节点2"
                },
                {
                    tag:"section",
                    children:[{
                        tag:"section",
                        text:"我是子子节点3"
                    }]
                },
            ]
        }
        //拿到根节点 拿到页面上 <div id="app"></div>这个真实 DOM 节点。
        //所以如果是拿 DOM 节点，要判断是 HTMLElement 还是 string, string 要通过 document.querySelector 拿
        let app = typeof this.options.el === 'string' ? document.querySelector(this.options.el) : (this.options.el)
        //根据根节点递归得到真实 DOM
        if (app) {
            ///拼接各个子节点树
            app.appendChild(this.render(data))
        }
    }

}

const vm = new Vue({
    el:'#app'
})
vm.init()
