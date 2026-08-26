/**
 * TODO 类型定义写前面
*/

//TODO 这里能用类型自动推断，T 参与了 a 和 b 的变量定义
function Zora<T>(a:T, b:T):Array<T>{
    return [a,b]
}

Zora(1,2)
Zora(true,false)

//TODO 这里不能用类型自动推断，T 没有参与后面的变量定义
type A<T> = string | number | undefined
let a:A<string> = 'zora'
let b:A<number> = 666


interface B<T>{
    msg:T,
}
let b1:B<number> = {
    msg:666
}

function add<T = number,K = number>(a:T, b:K):Array<T | K>{
    return [a,b]
}

add(1,2)
add(false,2)

//TODO Promise<T> resolve 出来的值是 T → then 成功回调的第一个参数就是 T
//手写 axios:
const axios = {
    get<T>(url:string):Promise<T> {
        return new Promise((resolve, reject) => {
            let xhr:XMLHttpRequest = new XMLHttpRequest()
            xhr.open("GET", url);
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    resolve(JSON.parse(xhr.responseText))
                }
            }
            xhr.send(null)
        })
    }
}

interface Data{
    message:string,
    code:number,
}
axios.get<Data>('./data.json').then(res=>{
    console.log(res.message,res.code)
})

