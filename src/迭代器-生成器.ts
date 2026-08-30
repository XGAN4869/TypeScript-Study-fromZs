/*
 * TODO 迭代器 生成器 可迭代对象？
        🚗生成器 本身就是 iterator, 所以 [Symbol.iterator]() 返回的是自己
        1. Generator 先通过 extends 成为 Iterator
        → 所以它的 [Symbol.iterator]() 可以声明返回 Generator
        → Generator 也就满足 Iterable 中的 :Generator
        * 源码路径指路👉 node_modules/typescript/lib/lib.es2015.generator.d.ts 🔗
*/

function* gen(){
    //yield 用于暂停产出值
    // yield 的值可以是 Promise，但普通生成器不会自动 await 它。
    // 因此 female.next().value 得到的是 Promise，而不是已经拆开的字符串。
    yield Promise.resolve('Zora')
    yield 'Raechel'
    yield 'Ruby'
    yield 'Kiran'

}

const female = gen()
console.log('female',female[Symbol.iterator]() === female)
console.log('迭代器',female[Symbol.iterator])
//不管同步异步都是按照顺序来的 | done:false 没有迭代完
console.log(female.next())
console.log(female.next())
console.log(female.next())
console.log(female.next())

//
/**
 * TODO 迭代器Iterator
 *  interface Iterator<T> {
 *   next(): {value:T, done:boolean}
 *  }
*/
// set: 去重 map：把引用类型当 key
//有 Symbol.iterator 的都是可以用 Set 的
let set:Set<string> = new Set("123")

//key 和 value，这俩 any ：工作的时候定义一下类型
let map:Map<number[],string> = new Map()
let Arr = [1,2,3]
map.set(Arr,'Zora') // Arr 引用类型为 key 存值 Zora
console.log(Arr)             //[ 1, 2, 3 ]
console.log(map.get(Arr))   //Zora

/**
 * TODO 可迭代对象Iterable：NodeList(document.xxx)、arguments、Set、Map 都有 [Symbol.iterator]，可以调用迭代器遍历。
 *  Set 和 Map 不是“伪数组”，这里强调的是它们都支持迭代协议。
 *  interface MyIterable<T> {
 *  [Symbol.iterator](): MyIterator<T>;
 *  }
*/

//手写 for...of
// function each(value:Map<any,any>){
//     const lt:any = value[Symbol.iterator]()
//     let next:any = { done:false }
//     while(!next.done){
//         console.log(lt.next(),'888')
//         next = lt.next()
//         if(!next.done){
//             console.log(next.value)
//         }
//     }
// }

function each(value:Map<any,any>){
    const it = value[Symbol.iterator]()
    // ✅明确类型：value可以是迭代产出的值，不是undefined
    let nextReturn: IteratorResult<any> = { value: undefined, done: false }

    while(!nextReturn.done){
        console.log(nextReturn,'999')
        nextReturn = it.next()
        if(!nextReturn.done){
            console.log(nextReturn.value,'888')
        }
    }
}
each(map)
console.log('👆')
console.log(map)

// TODO 迭代器的语法糖 for...of：它会先取 value[Symbol.iterator]，再反复调用 next()。
// 普通对象默认没有 Symbol.iterator，所以不能直接 for...of。
for(let value of set){
    console.log(value)
}

//TODO 解构 底层原理也是调用 Symbol.iterator

let a = [4,5,6]
let copy = [...a]
console.log(copy)

// TODO 让普通对象支持 for...of：给对象实现 Symbol.iterator，并返回一个迭代器对象。
let obj = {
    max:5,
    current:0,
    [Symbol.iterator](){
        // 每次开始遍历时，都创建一个独立的迭代器状态。
        // 这样同一个 obj 可以被多次遍历，每次都从 current=0 开始（见下方说明）。
        return{
            max:this.max,
            current:this.current,
            next(){
                // next() 必须返回 { value, done }。
                // done=false 表示本次还有值；done=true 表示遍历结束。
                if(this.current === this.max){
                    return {
                        value: undefined,
                        done: true
                    }
                }else{
                    // 先返回当前值，再把游标加 1，保证输出 0、1、2...max-1。
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
// 对象展开（不是对象解构）读取的是对象自身的可枚举属性，不会调用 Symbol.iterator。
let x1 = {...obj}
// 数组展开（不是数组解构）会调用 Symbol.iterator，因此得到 0、1、2、3、4。
let x2 = [...obj]
console.log(x1)
console.log(x2)



