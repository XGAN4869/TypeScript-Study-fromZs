/**
 * Options 接口：
 * 约束 new Vue({ ... }) 传入的配置对象有哪些字段、什么类型。
 *
 * el 可以是：
 * - 选择器字符串，例如 '#app'
 * - document.getElementById('app') 获取到的 HTMLElement
 */
interface Options {
    // TODO 定义 el 字段的类型
}


/**
 * VueClass 接口：
 * 用来约束 class Vue 必须具备哪些属性、哪些方法。
 */
interface VueClass {
    // TODO 定义 options 属性
    // TODO 定义 init 方法
}


/**
 * Vnode：
 * 虚拟 DOM 节点类型。
 *
 * children 再次使用 Vnode[]，
 * 这里有递归类型的意味。
 */
interface Vnode {
    // TODO 定义 tag 字段

    // TODO 定义可选的 text 字段

    // TODO 定义可选的 children 字段
}


/**
 * 虚拟 DOM 简单版
 * Dom 是 Vue 的父类。
 */
class Dom {

    /**
     * 创建节点方法
     *
     * TODO：
     * 根据传入的标签名，创建并返回真实 DOM 元素。
     */
    createElement() {
        // TODO
    }


    /**
     * 填充文本方法
     *
     * TODO：
     * 把文本内容设置到真实 DOM 元素中。
     */
    setText() {
        // TODO
    }


    /**
     * 渲染函数
     *
     * TODO：
     * 1. 根据 vnode 的 tag 创建根节点
     * 2. 判断当前节点是否有 children
     * 3. 如果有 children，就递归调用 render
     * 4. 把递归得到的子节点追加到根节点
     * 5. 如果没有 children，但有 text，就填充文本
     * 6. 返回当前根节点
     */
    render() {
        // TODO
    }
}


/**
 * Vue 类：
 *
 * extends：
 * 继承 Dom，可以使用父类中的 DOM 方法。
 *
 * implements：
 * 用来约束 Vue 类必须符合 VueClass 接口。
 */
class Vue extends Dom implements VueClass {

    // TODO 定义 options 属性


    /**
     * constructor：
     *
     * TODO：
     * 1. 接收 options 参数
     * 2. 因为继承了父类，所以先调用 super()
     * 3. 再使用 this 保存 options
     */
    // constructor() {
        // TODO
    // }


    /**
     * init 初始化方法：
     *
     * TODO：
     * 1. 准备一棵虚拟 DOM 树
     * 2. 获取挂载元素
     * 3. 判断 el 是字符串还是 HTMLElement
     * 4. 如果找不到挂载元素，抛出明确错误
     * 5. 调用 render 把虚拟 DOM 转成真实 DOM
     * 6. 把真实 DOM 追加到挂载元素中
     */
    init(): void {
        // TODO
    }
}


/**
 * 创建 Vue 实例
 *
 * TODO：
 * 传入配置对象，并指定挂载元素。
 */
// const vm = new Vue({
//     el: '#app'
// })


/**
 * 手动调用初始化方法，
 * 模拟 Vue 内部自动执行 init。
 */
// vm.init()