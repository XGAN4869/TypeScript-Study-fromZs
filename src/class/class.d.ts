/**
 * 源码版
 * instance.update()
 *     ↓
 * effect.run()
 *     ↓
 * componentUpdateFn()
 *     ↓
 * renderComponentRoot()
 *     ↓
 * patch(null, VNode)
 *     ↓
 * 真实 DOM
*/
/**
 * 简易版：模拟的是“首次挂载”的核心部分
 * vm.init()
 *     ↓
 * this.render(data)
 *     ↓
 * createElement()
 *     ↓
 * 递归 render()
 *     ↓
 * setText()
 *     ↓
 * appendChild()
 *     ↓
 * 返回真实 DOM
*/
export {};
//# sourceMappingURL=class.d.ts.map