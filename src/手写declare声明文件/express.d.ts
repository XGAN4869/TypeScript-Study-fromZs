//ts文件规范 express 包名 + .d.ts, 开头声明
declare module 'express' {

    interface Router {
        get(path:string,cb?:(req:any,res:any)=>void):void
    }

    interface App {
        //不推荐这种写法，会失去this
        // use:(path:string,router:any)=>void,
        use(path:string,router:any):void,
        listen(port:number,cb?:()=>void):void,
    }


    interface Express {
        // 代表：Express本身是函数，可以直接执行调用，调用返回App
        ():App
        // 代表这个函数对象上，有一个属性叫 Router，是方法，调用返回Router
        Router():Router
    }

    const express:Express;

    export default express;

}

//扩充全局变量
declare var a123:number;

declare function xxx(params:type)

declare class Vue123{}

declare enum C {
    a = 1
}