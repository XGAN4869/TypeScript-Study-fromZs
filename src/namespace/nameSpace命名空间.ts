//1.命名空间的案例
//2.命名空间的用法 嵌套抽离 导出 简化合并

//TODO 在 namespace 中所有的变量/方法 必须导出才能访问到

namespace Test {
    export let a = 1
    export function add<T>(a:T, b:T) {
        return [a,b]
    }
}

console.log(Test.add(1,2))

//TODO 支持合并，类似 interface

namespace Test {
    export let b = 22
}
console.log(Test.b)

import {Test1} from './test'

let a = Test1.add(1,2)
console.log('导入外部Test1',a)

/**
 * TODO 使用场景：跨端项目， h5 Android ios 小程序
 *      webView 嵌套上面的内容，可以用 nameSpace 拆分相关的逻辑
*/

namespace ios {
    export const pushNotification = (msg: string, type: number) => {

    }
}

namespace android {
    export const pushNotification = (msg: string) => {

    }
}

ios.pushNotification("消息", 1);
android.pushNotification("消息");


