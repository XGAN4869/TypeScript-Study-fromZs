export namespace Test1 {
    export let a = 1
    export function add<T>(a:T, b:T) {
        return [a,b]
    }
}