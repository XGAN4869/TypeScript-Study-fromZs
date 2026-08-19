# `this` 在 TypeScript、Vue 2 和 Vue 3 中的原理

## 一句话结论

`this` 不是 TypeScript 或 Vue 发明的，它来自 JavaScript，表示“当前这次调用把哪个对象当作执行上下文”。TypeScript 只负责检查它的类型；Vue 的 Options API 会把组件实例绑定为 `this`，Composition API 则主要通过普通变量、函数和闭包工作。

## 1. 原代码里的 `this` 是谁

```ts
interface Options {
  el: string | HTMLElement
}

interface VueCls {
  options: Options
  init(): void
}

class Vue implements VueCls {
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  init(): void {}
}

const vm = new Vue({ el: '#app' })
```

执行 `new Vue(...)` 时，可以按下面的顺序理解：

1. JavaScript 创建一个新的空对象。
2. 把这个新对象的原型连接到 `Vue.prototype`。
3. 调用 `constructor`，并让其中的 `this` 指向新对象。
4. 执行 `this.options = options`，把传入配置保存到实例属性。
5. 如果构造函数没有主动返回其他对象，`new` 返回这个新实例。

因此：

```ts
this.options = options
```

可以先近似理解为：

```ts
vm.options = options
```

这里的 `this` 就是将要返回的 `vm`。

## 2. `this` 由调用方式决定

### 对象调用

```ts
const user = {
  name: '小明',
  sayName() {
    console.log(this.name)
  },
}

user.sayName() // this 是 user
```

先看点号左边：`user.sayName()` 中的 `this` 通常就是 `user`。

### `new` 调用

```ts
class User {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

const user = new User('小明')
```

`new` 创建实例，并把构造函数里的 `this` 指向实例。

### 普通函数调用

```ts
function showThis() {
  console.log(this)
}

showThis()
```

在 ES Module、class 和严格模式下，这里的 `this` 通常是 `undefined`。

### `call`、`apply`、`bind`

```ts
function sayName(this: { name: string }) {
  console.log(this.name)
}

const user = { name: '小明' }

sayName.call(user)       // 临时指定 this
sayName.apply(user)      // 临时指定 this，参数传法不同

const boundSay = sayName.bind(user)
boundSay()               // 永久得到一个绑定后的新函数
```

### 箭头函数

```ts
const user = {
  name: '小明',
  normalMethod() {
    const readName = () => {
      console.log(this.name)
    }

    readName()
  },
}
```

箭头函数没有自己的 `this`，它沿用外层作用域中的 `this`。因此不能通过 `call()` 把箭头函数的 `this` 改成另一个对象。

## 3. TypeScript 到底约束了什么

JavaScript 决定运行时 `this` 真正指向谁；TypeScript 只在编译阶段检查你是否用对了。

### class 中自动推导实例类型

```ts
class User {
  name = '小明'

  sayName() {
    this.name.toUpperCase() // this 被推导为 User 实例
    // this.age             // TS 报错，因为 User 没有 age
  }
}
```

### 假的 `this` 参数

```ts
function sayName(this: { name: string }, prefix: string) {
  console.log(prefix + this.name)
}

sayName.call({ name: '小明' }, '你好，')
```

`this: { name: string }` 只给 TypeScript 检查，不是一个真实运行参数，编译为 JavaScript 后会被删除。

### `noImplicitThis`

建议在 `tsconfig.json` 中启用：

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict` 会包含 `noImplicitThis`，可以帮助发现 TypeScript 无法确定 `this` 类型的代码。

### `interface` 和 `implements` 不会控制运行时

```ts
class Vue implements VueCls {}
```

`implements VueCls` 只检查 `Vue` 类是否拥有 `options` 和 `init()`；它不会自动创建属性、不会自动绑定 `this`，编译后也不存在。

## 4. 为什么 Vue 2 经常写 `this`

Vue 2 主要使用 Options API：

```js
export default {
  data() {
    return {
      count: 0,
    }
  },

  computed: {
    doubleCount() {
      return this.count * 2
    },
  },

  methods: {
    increment() {
      this.count++
    },
  },

  mounted() {
    this.increment()
  },
}
```

Vue 2 创建组件实例 `vm` 后，会进行类似下面的初始化：

- 将 `data` 中的数据代理到 `vm` 上，因此能写 `this.count`；
- 将 `methods` 中的方法绑定到 `vm`；
- 将 `computed` 定义到 `vm`；
- 调用生命周期钩子时，把 `vm` 作为 `this`；
- 在实例上提供 `$emit`、`$refs`、`$router` 等公共能力。

所以 Vue 2 的 `this` 可以近似理解为“当前组件实例 `vm`”。

## 5. Vue 3 真的不用 `this` 吗

不完全正确。关键区别不是“Vue 2 与 Vue 3”，而是“Options API 与 Composition API”。

### Vue 3 Options API 仍然使用 `this`

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 0,
    }
  },

  methods: {
    increment() {
      this.count++
    },
  },

  mounted() {
    this.increment()
  },
})
```

Vue 3 仍完整支持 Options API。Vue 3 底层会创建组件内部实例和一个组件公共代理；访问 `this.count` 时，代理会到 `setup` 返回值、`data`、props、methods、computed、公共属性等来源中查找对应内容。

### Vue 3 Composition API 通常不用 `this`

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const count = ref(0)

const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  increment()
})
</script>
```

这里直接使用同一作用域中的 `count`、`increment` 和 `doubleCount`。函数通过 JavaScript 的词法作用域形成闭包，所以不需要从 `this` 上寻找数据和方法。

官方明确说明：`setup()` 自身没有组件实例访问权，在 `setup()` 中访问 `this` 会得到 `undefined`。

## 6. Vue 3 Composition API 底层如何知道当前组件

不用 `this` 不代表底层没有组件实例。

Vue 调用某个组件的 `setup()` 前，会在框架内部记录“当前正在初始化的组件实例”。因此：

```ts
onMounted(() => {})
inject('key')
provide('key', value)
```

这些 API 能把信息注册到当前组件上。执行完 `setup()` 后，Vue 恢复之前的当前实例。

与此同时：

- `ref()`、`reactive()` 创建响应式数据；
- 渲染过程中读取这些数据时，Vue 收集依赖；
- 数据修改后，Vue 重新执行相关渲染；
- `<script setup>` 中的局部变量可被编译后的模板渲染函数直接访问。

因此 Composition API 主要依赖“普通变量 + 闭包 + 响应式依赖收集 + 当前组件上下文”，不是依赖 `this`。

## 7. Vue 2 和 Vue 3 是不是共用一份 `this` 底层

不是。

Vue 2 和 Vue 3 是两套不同版本的运行时实现。Vue 3 为了继续支持 Options API，保留了组件公共实例和 `this` 行为；同时又提供了不依赖 `this` 的 Composition API。

可以按下面理解：

```text
Vue 2 Options API
    数据和方法集中代理到 vm
    方法调用时 this → vm

Vue 3 Options API
    数据和方法通过组件公共 Proxy 暴露
    方法调用时 this → 组件公共 Proxy

Vue 3 Composition API
    setup / script setup 中直接使用局部变量和函数
    不通过 this 访问组件状态
```

Vue 2.7 也内置了 Composition API，因此也不能简单记成“Vue 2 必须使用 `this`”。更准确的记法是：

- Options API 倾向于使用 `this`；
- Composition API 倾向于使用局部变量和闭包；
- Vue 3 同时支持两者；
- Vue 官方没有废弃 Options API 的计划。

## 8. Vue 如何给 Options API 的 `this` 做 TS 类型约束

运行时和类型约束是两层事情：

### 运行时层

Vue 创建组件公共实例/代理，把方法的调用上下文绑定到它，因此 `this.count` 真能访问组件状态。

### TypeScript 层

`defineComponent()` 根据 props、data、computed、methods 和 setup 返回值推导出组件公共实例类型。概念上可以理解为：

```ts
type ComponentThis =
  Props &
  Data &
  ComputedValues &
  Methods &
  VuePublicProperties
```

实际的 Vue 类型定义复杂得多，还会使用泛型、条件类型、交叉类型、重载和 TypeScript 的上下文 `this` 类型能力。

```ts
export default defineComponent({
  props: {
    name: String,
  },

  data() {
    return {
      count: 0,
    }
  },

  computed: {
    doubleCount() {
      return this.count * 2
    },
  },

  methods: {
    printInfo() {
      this.name
      this.count
      this.doubleCount
      // this.unknownValue // TS 报错
    },
  },
})
```

如果插件增加了 `$http` 等全局属性，还需要通过 `ComponentCustomProperties` 做模块扩展，告诉 TypeScript 这个属性确实存在。

## 9. 最常见的 `this` 坑

### Options API 的 methods 不要写箭头函数

错误示例：

```ts
export default defineComponent({
  data() {
    return { count: 0 }
  },

  methods: {
    increment: () => {
      // 箭头函数没有自己的 this，不能让 Vue 重新绑定
      this.count++
    },
  },
})
```

正确示例：

```ts
export default defineComponent({
  data() {
    return { count: 0 }
  },

  methods: {
    increment() {
      this.count++
    },
  },
})
```

### 类方法被单独取出后可能丢失 `this`

```ts
class Counter {
  count = 0

  increment() {
    this.count++
  }
}

const counter = new Counter()
const increment = counter.increment

increment() // 严格模式下 this 是 undefined
```

可根据场景写成：

```ts
const increment = counter.increment.bind(counter)
```

或者：

```ts
class Counter {
  count = 0

  increment = () => {
    this.count++
  }
}
```

## 10. 可模仿的判断顺序

以后看到 `this.xxx`，按下面顺序判断：

1. 先问：这是不是箭头函数？如果是，它沿用外层 `this`。
2. 如果是普通函数，查看它怎么被调用，而不只是在哪里声明。
3. `对象.方法()`：`this` 通常是点号左边的对象。
4. `new 类名()`：构造函数里的 `this` 是新实例。
5. `call/apply/bind`：`this` 被显式指定。
6. Vue Options API：`this` 通常是组件公共实例。
7. Vue Composition API 的 `setup()` / `<script setup>`：不要依赖 `this`，直接用变量和函数。
8. 最后再看 TypeScript 是否正确推导或显式标注了 `this` 类型。

## 官方资料

- [Vue 组合式 API：setup()](https://cn.vuejs.org/api/composition-api-setup.html)
- [Vue TypeScript 与选项式 API](https://cn.vuejs.org/guide/typescript/options-api.html)
- [Vue 组合式 API常见问答](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript this 参数](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)

## 一句话总结

`this` 的真实指向由 JavaScript 的调用方式决定，TypeScript 负责检查它，Vue Options API 把组件公共实例绑定给它，而 Composition API 通过局部变量、闭包和响应式系统绕开了对它的依赖。
