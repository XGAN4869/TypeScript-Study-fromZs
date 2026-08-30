/**
 * TODO 泛型类型，T 可以类比为函数中的形参，不过编译后会被擦除
 *  <T>       // 声明类型参数 T
 *  arg       // 普通变量（形参）
 *  T         // 泛型变量/类型参数
 *  T[]       // 由 T 构成的数组类型
*/
function identity<T>(arg: T): T {
    return arg;
}
// <T>(arg: T) => T 用来描述函数类型，因为上面的 identity 本身是函数附带了泛型
let myIdentity: <T>(arg: T) => T = identity;

// 显式传入类型实参 string
identity<string>("hello"); // T = string
// 让 TypeScript 自动推断
identity(42); // T = number

/**
 * // 1编译后
 * function identity(arg) {
 *     return arg;
 * }
 * // 2编译后，类型直接删掉
 * let myIdentity = identity;
*/

/**
 * TODO 泛型类型 type 定义 两者在仅描述函数调用时完全等价
*/
type T1 = <T>(arg: T) => T
type T2 = { <T>(arg: T): T }
let a:T1 = identity
let b:T2 = identity

/**
 * TODO interface 描述的完整函数类型，只能标注在变量上，不能直接修饰`function`声明。
 *      想要直接应用接口类型，改用**函数表达式赋值给变量**。
*/
//下面这个是完整的 function 类型 interface
interface GenericIdentityFn {
    <T>(arg: T): T;
}
//function 函数
function identity1<T>(arg: T): T {
    return arg;
}
//变量赋值 function 函数，可以用 interface 判断 去接收完整 fucntion
let myIdentity1: GenericIdentityFn = identity1;

// 如果你想锁定 T 的类型 👇

interface GenericIdentityFn2<T> {
    (arg: T): T;
}

function identity2<T>(arg: T): T {
    return arg;
}

let myIdentity2: GenericIdentityFn2<number> = identity2;

/**
 * TODO function 中形参的属性 以及 和泛型类型相对应的 泛型变量
*/
// arg 没有 length 属性！
function loggingIdentity1<T>(arg: T): T {
    // console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

// TODO 除非修正成👇 也就是 T[]泛型变量
function loggingIdentity11<T>(arg: T[]): T[] {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}

interface Lengthwise {
    length: number;
}

/**
 * TODO
 *  interface Lengthwise       // 类型描述
 *  <T extends Lengthwise>     // 对 T 的类型约束
 *  arg: T                     // 形参类型
 *  ): T                       // 返回值类型
*/

function loggingIdentity2<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // args 是运行时的值， T 是类型参数，不嫩 T.length
    return arg;
}