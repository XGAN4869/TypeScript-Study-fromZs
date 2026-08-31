//2.类的混入 A类B类合并到一起

/**
 * TODO important!!
     1. TypeScript 有点特殊：当 App 出现在“类型位置”时，它表示产品类型：
     const app: App = new App();
                ↑
            App 实例类型
     2. 如果想描述“模具本身”，则是：
     typeof App
*/

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
 * TODO interface IConstructor<T> {
 *     new (...args: any[]): T
 * }
*/
//描述 class 类的模板
type AppConstructor<T> = new (...args:any[]) => T

/**
 * !important
 * TODO T extends App //T 是 App 实例
 * TODO T extends Constructor<App> // T 是能够创建 App 实例的类型
 * TODO typeof App // 精确表示 App 这个类本身
     new (...args: any[]) => App
     └── new：类型层面标记：此函数只能用new调用，不能普通直接调用()
     └── (...args: any[])：构造函数接收任意参数
     └── => App：new之后，返回的实例类型是 App
*/
function pluginMixins<Tbase extends AppConstructor<App>>(Base:Tbase){
    return class extends Base {
        private logger: Logger;
        private html: HTML;

        constructor(...args:any[]) {
            super(...args);
            console.log(...args)
            this.logger = new Logger()
            this.html = new HTML();
        }

        run(){
            this.logger.log('Welcome Zora, its your paradise')
            this.html.render();
        }
    }
}

const pluginClass = pluginMixins(App)

const appInstance = new pluginClass()