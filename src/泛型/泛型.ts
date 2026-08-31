//泛型: 动态类型

function zora(a:number,b:number):Array<number>{
    return [a,b]
}

function zora1(a:string,b:string):Array<string>{
    return [a,b]
}

//T 即 Type
function zora2<T>(a:T,b:T):Array<T>{
    return [a,b]
}

//调用的时候不需要写<>它自己会推断出来的
zora2(1,2)
zora2('1','2')

//type 定义并使用泛型
type A<T> = string | number | T
let a:A<undefined>

//interface 定义并使用泛型
interface Data<T> {
    msg:T
}
let data:Data<number> = {
    msg:1
}

function add<T = number,K = string>(a:T, b:K):Array<T | K>{
    return [a,b]
}
add(1,false)


//实战
const axios = {
    get<T>(url:string):Promise<T> {
        return new Promise((resolve, reject) => {
            let xhr:XMLHttpRequest = new XMLHttpRequest()
            xhr.open('GET',url)
            xhr.onreadystatechange = ()=> {
            if(xhr.readyState == 4 && xhr.status == 200){
                resolve(JSON.parse(xhr.responseText))
            }
            }
        })
    }
}

interface Data2 {
    message:string
    code:number
}

axios.get<Data2>("./fakeJson.json").then(res=>{
        console.log(res.code)
    }
)
