# TypeScript + ts-node 项目启动指南

这份笔记用于以后新建或重新启动 TypeScript 项目，全程不使用 `npx`。

## 一、新建项目

```powershell
mkdir my-ts-project
cd my-ts-project
npm init -y
```

安装相互兼容的版本：

```powershell
npm install -D typescript@5.9.3 ts-node@10.9.2 @types/node
```

不要在项目里执行：

```powershell
npm install nvm
```

npm 里的 `nvm` 不是 Windows 使用的 NVM。Node 版本管理工具应该在系统中单独安装。

## 二、创建目录和入口文件

推荐目录结构：

```text
my-ts-project
├─ src
│  └─ index-codeRain.ts
├─ package.json
└─ tsconfig.json
```

`src/index-codeRain.ts` 示例：

```ts
function sayHello(name: string): string {
  return `你好，${name}`
}

console.log(sayHello('Zora'))
```

注意：函数的返回值不会自动显示，必须使用 `console.log()` 才能在终端看到结果。

## 三、配置 tsconfig.json

可以先使用这份简单配置：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "types": ["node"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

## 四、配置运行命令

在 `package.json` 中加入：

```json
{
  "scripts": {
    "start": "ts-node src/index-codeRain.ts",
    "dev": "ts-node src/index-codeRain.ts",
    "check": "tsc --noEmit"
  }
}
```

运行项目：

```powershell
npm start
```

或者：

```powershell
npm run dev
```

npm 会自动找到项目 `node_modules` 中的本地 `ts-node`，不需要全局安装，也不需要 `npx`。

## 五、直接运行本地 ts-node

如果不想使用 npm 脚本，可以在 PowerShell 中直接执行：

```powershell
.\node_modules\.bin\ts-node.cmd src\index-codeRain.ts
```

如果系统已经全局安装了兼容版本，也可以执行：

```powershell
ts-node src\index-codeRain.ts
```

使用 NVM 切换 Node 版本后，全局安装的 `ts-node` 可能会消失或发生变化。因此，更推荐使用项目本地依赖配合 `npm start`。

## 六、重新启动已有项目

进入项目根目录后执行：

```powershell
npm install
npm start
```

如果运行失败，检查实际安装的版本：

```powershell
npm ls typescript ts-node --depth=0
```

推荐版本：

```text
ts-node@10.9.2
typescript@5.9.3
```

然后检查 TypeScript 类型错误：

```powershell
npm run check
```

如果还没有配置 `check`，可以直接运行：

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

## 七、常见问题

### 1. 更换 Node 版本后仍然无法运行

Node 版本不是唯一影响因素，`ts-node` 和 `typescript` 也必须相互兼容。

例如，`ts-node@10.9.2` 不能正常兼容 `typescript@7.0.2`。可能出现下面的错误：

```text
TypeError: Cannot read properties of undefined (reading 'fileExists')
```

此时应把 TypeScript 固定到兼容版本：

```powershell
npm install -D typescript@5.9.3 --save-exact
```

### 2. 程序运行后什么也没显示

下面的代码会执行函数，但不会打印返回结果：

```ts
sayHello('Zora')
```

需要改成：

```ts
console.log(sayHello('Zora'))
```

### 3. 如何确认 ts-node 已经正常工作

```powershell
ts-node -e "console.log('ts-node working')"
```

看到下面的输出就说明可以正常运行：

```text
ts-node working
```

## 八、最简操作清单

新项目：

```powershell
npm init -y
npm install -D typescript@5.9.3 ts-node@10.9.2 @types/node
```

在 `package.json` 中配置：

```json
{
  "scripts": {
    "start": "ts-node src/index-codeRain.ts",
    "check": "tsc --noEmit"
  }
}
```

以后启动：

```powershell
npm install
npm start
```

核心原则：

> `ts-node` 和 `typescript` 的版本必须兼容；项目优先使用本地依赖，通过 npm scripts 运行，不依赖 `npx`。
