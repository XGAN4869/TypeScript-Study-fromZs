/**
 * TODO extends：运行时继承，有父类，派生类构造函数需要先调用 super()。
 *      implements：只做类型检查，不是真继承，不需要也不能调用 super()。
 *      extends 是“真正继承实现”，implements 只是“让编译器检查外形”。
*/

// Disposable Mixin
class Disposable {
    isDisposed: boolean | undefined;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean | undefined;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}
/**
 * implements只是做接口校验，不会帮你实现任何方法，只是强制你把成员声明出来。运行时真正拷贝方法靠下面applyMixins函数。
*/
class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }

    // Disposable
    isDisposed: boolean = false;
    /**
     * TODO 类内 declare xxx:Type：仅类型声明，编译完全移除，
     *      不产生 JS 代码。适合 mixin 这种方法挂在原型、不在类源码实现的场景。
    */
    declare dispose: () => void;
    // Activatable
    isActive: boolean = false;
    declare activate: () => void;
    declare deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}