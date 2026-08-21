//1. 生成器

function* gen(){
    yield Promise.resolve('Zora') //同步异步
    yield 'Raechel'
    yield 'Ruby'
    yield 'Kiran'
}

//不管同步异步都是按照顺序来的 | done:false 没有迭代完
const female = gen()
console.log(female.next())
console.log(female.next())
console.log(female.next())
console.log(female.next())

//2. 迭代器
//3. set: 去重 map：把引用类型当 key

let set:Set<number> = new Set([1,2,3,1,2,3])

//key 和 value，这俩 any ：工作的时候定义一下类型
let map:Map<any,any> = new Map()
let Arr = [1,2,3]
map.set(Arr,'Zora') // Arr 引用类型为 key 存值 Zora
console.log(Arr)             //[ 1, 2, 3 ]
console.log(map.get(Arr))   //Zora

/**
 * 4. TODO 伪数组：NodeList(document.xxx), arguments,set, map 都有迭代器[Symbol.iterator], 可以调用迭代器遍历
*/

const each = (value: any) => {
    let It: any = value[Symbol.iterator]()
    let next: any = { done: false }
    while (!next.done) {
        next = It.next()
        if (!next.done) {
            console.log(next.value)
        }
    }
}

each(map)

//5. 迭代器的语法糖 for ... of ，对象不可用，因为对象身上没有 Symbol.iterator
for(let value of set){
    console.log(value)
}

//6. 解构 底层原理也是调用 Symbol.iterator

let a = [4,5,6]
let copy = [...a]
console.log(copy)

//7. 对象支持 for ... of
let obj = {
    max:5,
    current:0,
    [Symbol.iterator](){
        return{
            max:this.max,
            current:this.current,
            next(){
                if(this.current === this.max){
                    return {
                        value: undefined,
                        done: true
                    }
                }else{
                    return {
                        value:this.current++,
                        done:false
                    }
                }
            }
        }
    }
}
for(let value of obj){
    console.log(value)
}
//对象的解构底层调用的不是 Symbol.iterator
let x1 = {...obj}
//数组的解构底层调用的不是 Symbol.iterator
let x2 = [...obj]
console.log(x1)
console.log(x2)



