# Vue `template` 到 `render` 函数的生成链路

## 这个 function 是干嘛的

Vue 需要一个 `render` 函数来产生 VNode（虚拟 DOM）。用户写的 `template` 只是字符串，不能直接执行，所以 Vue 要把它变成可以调用的 JavaScript 函数。

在 Vue 2（`new Vue`、`$mount` 这套 API）中，完整链路可以记成：

```text
template 字符串
  -> parser 解析
AST（描述标签、属性、文本、插值的普通对象）
  -> optimizer 标记静态节点
  -> codegen 递归生成 JavaScript 代码字符串
render 代码字符串
  -> new Function(code)
真正可调用的 render 函数
  -> render.call(vm)
VNode
  -> patch
真实 DOM
```

## 它接收什么数据

编译器接收的是模板字符串，例如：

```html
<div id="app">你好，{{ name }}</div>
```

运行时的 `render` 函数接收的不是模板字符串，而是在 Vue 实例上执行时使用的上下文。Vue 2 中通常可以把它理解成：

```js
render.call(vm, vm.$createElement)
```

其中 `vm` 提供 `data`、`computed`、`methods` 等属性，`$createElement` 用来创建 VNode。

## 它返回什么结果

`render` 函数返回一个 VNode，或者 VNode 数组。它不是直接返回 HTML 字符串：

```js
function render(h) {
  return h('div', 'hello') // 返回 VNode
}
```

Vue 后续再把 VNode 与旧 VNode 比较，并把差异更新到真实 DOM。

## 中间做了哪几步

### 1. parser：把模板解析成 AST

AST（抽象语法树）只是 JavaScript 对象，是模板结构的“说明书”，例如可以简化成：

```js
{
  type: 1,
  tag: 'div',
  attrs: [{ name: 'id', value: 'app' }],
  children: [
    { type: 2, text: '你好，{{ name }}', expression: '你好，' + _s(name) }
  ]
}
```

它仍然不是函数，不能写成 `ast()` 执行。它的作用是让后面的代码生成器不用重新解析字符串，而是按树结构递归处理每个节点。

### 2. optimizer：标记静态节点

Vue 会判断哪些节点不依赖响应式数据。例如纯文本和没有动态绑定的静态节点，可以标记为 static。这样生成的 `staticRenderFns` 可以缓存，更新数据时少做重复工作。

这一步主要是性能优化，不是把 AST 变成函数的关键步骤。

### 3. codegen：把 AST 递归“翻译”为 JavaScript 代码字符串

关键点是：AST 不会凭空变成函数，而是先被拼接成一段 JavaScript 源码。

以这个模板为例：

```html
<div id="app">你好，{{ name }}</div>
```

代码生成器大致会做这些事：

```text
元素节点 div
  -> _c('div', data, children)
属性 id="app"
  -> { attrs: { id: 'app' } }
文本和插值
  -> _v('你好，' + _s(name))
```

最后拼成类似这样的代码字符串（这是 Vue 2 的简化示意）：

```js
with (this) {
  return _c(
    'div',
    { attrs: { id: 'app' } },
    [_v('你好，' + _s(name))]
  )
}
```

Vue 2 源码里常见的生成结果会压缩成一行：

```js
with(this){return _c('div',{attrs:{id:'app'}},[_v('你好，'+_s(name))])}
```

这里的 `_c`、`_v`、`_s` 是 Vue 注入的运行时辅助方法：

| 生成代码 | 大致含义 |
| --- | --- |
| `_c(...)` | `createElement`，创建元素 VNode |
| `_v(...)` | `createTextVNode`，创建文本 VNode |
| `_s(value)` | `toString`，把插值转换成文本 |
| `_m(index)` | 执行缓存的静态 `render` 函数 |
| `_l(list, fn)` | `renderList`，处理 `v-for` |

### 4. `new Function`：把代码字符串变成真正的函数

编译器拿到上面的字符串后，会做类似的事情：

```js
const code = "with(this){return _c('div',[_v(_s(name))])}"
const render = new Function(code)
```

此时 `render` 才从“源码字符串”变成了真正可以调用的函数。Vue 2 的 `compileToFunctions` 就承担了“生成代码 + 创建函数 + 缓存函数”这类工作。

所以“AST 后突然有了 render”的中间过程，其实是：

```text
AST -> render 字符串 -> new Function -> render 函数
```

### 5. 执行 render：函数产生 VNode

组件挂载时，Vue 会在 `_render` 中调用这个函数，概念上类似：

```js
const vnode = vm.$options.render.call(vm, vm.$createElement)
```

由于生成代码使用了 `with(this)`，模板里写的 `name` 可以从 `vm` 上找到；`_c`、`_v`、`_s` 也已经被 Vue 放到了当前实例可访问的渲染上下文中。

## `render` 到底从哪里来

### 手写 `render`

你可以直接写：

```js
new Vue({
  data: { name: '小明' },
  render(h) {
    return h('div', `你好，${this.name}`)
  }
}).$mount('#app')
```

这里的 `render` 是开发者自己提供的，Vue 不需要再把 `template` 编译一遍。

### 运行时编译 `template`

如果写的是：

```js
new Vue({
  data: { name: '小明' },
  template: '<div>你好，{{ name }}</div>'
}).$mount('#app')
```

在包含编译器的 Vue 构建版本中，`$mount` 阶段会调用 `compileToFunctions`，把 `template` 编译成 `options.render`，然后再走普通挂载流程。

### `.vue` 单文件组件

```vue
<template>
  <div>你好，{{ name }}</div>
</template>
```

通常由 `vue-loader` 在构建阶段调用 Vue 编译器。打包产物里已经包含类似 `render` 和 `staticRenderFns` 的函数代码，浏览器运行时直接执行它们。因此生产环境常用 runtime-only 构建版本，也能渲染 `.vue` 组件，因为模板编译工作已经提前完成。

## 模板来源优先级怎么理解

在 Vue 2 的运行时编译挂载逻辑中，可以按下面理解：

```text
已有 options.render
  -> 直接使用，不再编译
没有 render，但有 options.template
  -> 编译 template
既没有 render，也没有 template，但有 el
  -> 读取 el.outerHTML，再编译
```

`new Vue({ el: '#app' })` 本质上是实例创建后自动调用挂载逻辑；而没有 `el` 时，实例可以先停留在 created 等初始化阶段，之后手动调用 `vm.$mount('#app')`。如果手动挂载时实例只有 `template`，编译通常就在这次 `$mount` 的编译版本逻辑里发生。

## 小白应该怎么模仿

遇到“某个对象怎么突然变成函数”时，固定追四个问题：

1. 先找解析器：它把输入字符串变成了什么数据结构？
2. 再找代码生成器：它是否把数据结构拼成了源码字符串？
3. 再找函数构造处：是否出现 `new Function`、`eval` 或模块打包导出？
4. 最后找调用处：这个函数被谁用什么 `this` 执行，返回的又是什么？

Vue 这条链路的可模仿伪代码是：

```js
// 示例代码仅供参考，需要你手动复制到项目中。

function compile(template) {
  // 1. 字符串 -> AST
  const ast = parse(template)

  // 2. AST -> JavaScript 源码字符串
  const code = generate(ast)

  // 3. 源码字符串 -> 真正的函数
  return new Function(code)
}
```

## 举一反三

这类“编译器函数”一般固定按：

1. 先解析输入，建立 AST 或中间对象。
2. 再遍历 AST，把每种节点翻译成目标语言代码。
3. 再把代码字符串交给函数构造器，得到可执行函数。
4. 最后在正确的上下文中调用函数，拿到运行结果。

应该把“解析”“生成代码”“创建函数”分成不同职责，便于调试。实际工程里还会加入静态节点优化、错误提示、缓存和 source map。`template`、`render` 和 VNode 也不要混为一谈：`template` 是输入文本，`render` 是可执行程序，VNode 是程序执行后的结果。

## 一句话总结

AST 只是模板结构的对象描述；Vue 的 codegen 先把 AST 递归翻译成 `with(this){return _c(...)}` 这样的 JavaScript 字符串，再通过 `new Function` 把字符串装配成真正的 `render` 函数。
