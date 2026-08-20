# Vue 虚拟 DOM 渲染机制与手搓代码对照

参考：[Vue 官方文档：渲染机制](https://cn.vuejs.org/guide/extras/rendering-mechanism.html)

## 这个 function 是干嘛的

这里主要分析的是 `Dom.render(data)`。

它接收一个虚拟节点，递归遍历整棵虚拟节点树，为每个虚拟节点创建真实 DOM，最后返回当前节点对应的真实 DOM 子树。

不过要注意命名差异：

- Vue 官方的“渲染函数”负责**返回虚拟 DOM 树**。
- 这份练习代码的 `render()` 负责**把虚拟 DOM 树转换成真实 DOM**。
- 因此，练习代码的 `render()` 更接近简化版的 `mountVNode()` 或 `createDomFromVNode()`。

## 它接收什么数据

`render(data)` 接收一个 `Vnode`：

- `tag`：要创建的 HTML 标签。
- `text`：节点的文本。
- `children`：子虚拟节点数组。

`children?: Vnode[]` 是递归类型，因为每个子节点仍然可以拥有自己的子节点。

## 它返回什么结果

它返回当前 `Vnode` 对应的真实 DOM 元素。

`return root` 不会再次触发递归。真正触发递归的是：

```ts
const child = this.render(item)
```

子调用完成后，把已经创建好的真实子元素返回给上一层；上一层再通过 `appendChild` 把它接到父元素上。

## 它中间做了哪几步

1. 使用当前 VNode 的 `tag` 创建真实元素。
2. 如果存在 `children`，逐个递归渲染子 VNode。
3. 每次递归返回一个真实子元素。
4. 把真实子元素追加到当前真实父元素。
5. 如果没有子节点，就处理当前节点的文字。
6. 返回当前已经组装完成的真实 DOM 子树。

以最深层节点为例，执行顺序大致是：

```text
render(根 div)
  → render(第三个 section)
    → render(最里面的 section)
      → 创建元素并设置文字
      → 返回最里面的真实 section
    → 追加到第三个真实 section
    → 返回第三个真实 section
  → 追加到根 div
→ 返回完整的真实 div
```

## 官方原理和练习代码的关系

官方渲染管线是：

```text
Template
  → 编译成 render function
  → render function 返回 VNode tree
  → 运行时渲染器执行 mount / patch
  → Actual DOM
```

练习代码是：

```text
手写 data: Vnode
  → Dom.render(data) 递归创建真实 DOM
  → app.appendChild(...)
  → Actual DOM
```

| 官方概念 | 练习代码 | 关系 |
| --- | --- | --- |
| Template | 没有实现 | 练习直接跳过模板 |
| Compiler | 没有实现 | 没有把模板编译成渲染函数 |
| Render function | `init()` 中手写的 `data` | `data` 相当于渲染函数本应返回的结果 |
| VNode | `Vnode` 接口和 `data` 对象 | 都是用普通 JS/TS 对象描述 UI |
| VDOM tree | 嵌套的 `children` | 父子 VNode 组成树 |
| Runtime renderer | `Dom.render()` | 遍历 VNode 并操作真实 DOM |
| Mount | `render(data)` 加 `appendChild` | 首次创建并插入真实 DOM |
| Actual DOM | `createElement`、`textContent`、`appendChild` 的结果 | 浏览器最终显示的元素 |
| Reactive effect | 没有实现 | 不会追踪响应式数据 |
| Patch / diff | 没有实现 | 不会比较新旧 VNode |
| 编译优化 | 没有实现 | 没有静态缓存、patch flag、区块树等 |

## 编译、挂载、更新分别对应什么

### 1. 编译

真实 Vue 会把模板：

```html
<div><section>我是子节点1</section></div>
```

编译成一个渲染函数。调用这个函数后才会得到 VNode 树。

练习代码没有模板和编译器，而是在 `init()` 里直接手写 `data: Vnode`。所以它模拟的是“编译已经完成后的产物”。

### 2. 挂载

真实 Vue 的运行时渲染器遍历 VNode 树，创建真实 DOM。

练习代码中的以下部分就在模拟首次挂载：

- `createElement()`：创建真实元素。
- `setText()`：设置文本。
- `render()`：递归遍历 VNode 树。
- `appendChild()`：建立真实 DOM 的父子关系。
- `app.appendChild(this.render(data))`：把最终结果插入挂载点。

这部分已经抓住了虚拟 DOM 首次挂载的核心思想。

### 3. 更新

真实 Vue 在响应式数据变化后会：

1. 再次运行渲染函数。
2. 创建一棵新的 VNode 树。
3. 比较新旧 VNode 树。
4. 只把必要变化应用到真实 DOM。

练习代码目前没有这部分。再次调用 `vm.init()` 不会更新旧 DOM，而是会重新创建一整棵 DOM，并再次追加到 `#app` 中。

要继续模拟更新，至少还需要：

- 保存旧 VNode。
- 根据新状态生成新 VNode。
- 编写 `patch(oldVNode, newVNode, el)`。
- 比较标签、文本、属性和子节点。
- 只修改发生变化的真实 DOM。

## TypeScript 部分和 Vue 原理的关系

- `Options`：只负责约束初始化配置，不是虚拟 DOM 的核心。
- `VueClass` 和 `implements`：只负责检查类的形状，不会生成运行时代码。
- `extends Dom`：用于复用练习中的 DOM 方法；这是一种教学设计，不代表真实 Vue 必须通过类继承实现渲染器。
- `Vnode`：与虚拟 DOM 原理关系最直接，它规定了虚拟节点的数据形状。
- `children?: Vnode[]`：同时体现了递归类型和树结构。

## 小白应该怎么模仿

建议按以下顺序理解和手写：

1. 先写 `Vnode`，学会用对象描述 UI。
2. 再写“单个 VNode 转真实 DOM”。
3. 再用递归支持多层 `children`。
4. 再写挂载点查找和首次挂载。
5. 最后新增响应式状态、新旧 VNode 和 `patch`，模拟更新阶段。

## 示例代码

示例代码仅供参考，需要你手动复制到项目中。

为了让命名更贴近官方概念，可以把练习中的方法在脑中理解成：

```ts
// 它不是“返回 VNode 的渲染函数”。
// 它是“遍历 VNode 并创建真实 DOM 的首次挂载函数”。
function mountVNode(vnode: Vnode): HTMLElement {
    // 1. 创建当前真实元素
    // 2. 递归挂载所有子 VNode
    // 3. 处理文本
    // 4. 返回当前真实 DOM 子树
}
```

## 举一反三

这类渲染逻辑一般按下面的固定顺序编写：

1. 先定义节点的数据结构。
2. 再处理当前节点。
3. 递归处理子节点。
4. 返回当前完整子树。
5. 在入口处挂载根节点。
6. 需要更新时，额外保存旧树并比较新树。

值得模仿的写法是每一层 `render` 都返回当前真实根元素。这样子调用负责造好自己的 DOM 子树，父调用只负责接收并追加，递归职责很清楚。

当前练习没有响应式状态，因此暂时不需要 `computed` 或 `watch`。它们属于“状态如何变化”的层面；`patch` 属于“变化之后如何高效更新 DOM”的层面。

## 一句话总结

你的代码已经实现了“手写 VNode + 递归首次挂载”的核心，但还没有实现真实 Vue 的“模板编译、响应式依赖追踪、新旧 VNode 比对和最小化更新”。

