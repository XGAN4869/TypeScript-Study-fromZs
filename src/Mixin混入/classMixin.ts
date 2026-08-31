//2.类的混入 A类B类合并到一起

//插件类型混入
class Logger {
    log(msg:string){
        console.log(msg)
    }
}
//插件2：
class HTML {
    render(){
        console.log('render 方法被引入')
    }
}
class App {
    run(){
        console.log('我是 App 类')
    }
}
//interface 写法
/**
 * interface IConstructor<T> {
 *     new (...args: any[]): T
 * }
*/
//描述 class 类的模板
type Constructor<T> = new (...args:any[]) => T

/**
 * !important TODO 如果写 T extends App: T 必须是 App 实例或者 App 的子类实例。 TS 看到 class 声明，自动帮你创建同名类型，这个类型描述实例。不是你写出来的，是 class 语法自带的。
 *  这里是指，T 是 类（可被 new 的),这个 App 不是类型，所以我们要创造一个 class 类型
*/
function pluginMixins<T extends Constructor<App>>(){

}