# React Render Props 巩固练习

通过 4 个循序渐进的练习，深入理解 Render Props 的使用场景与思想。

## 📚 练习内容

### 练习 1：基础理解
- 实现 `Logger` 组件
- 每 1 秒钟随机生成一个 1~100 的数字
- 通过 render props 传递给外部渲染

### 练习 2：复用逻辑
- 实现 `MouseTracker` 组件
- 同时使用两个 render props 组件
- 体会"逻辑复用 + UI 灵活组合"

### 练习 3：render props 组合
- 组合使用 `DataProvider` 和 `MouseTracker`
- 展示 render props 的嵌套使用
- 每个组件控制自己的逻辑与状态

### 练习 4：理解 Hooks 替代方案
- 用自定义 Hook `useMousePosition` 替代 render props
- 对比两种方式的优缺点
- 理解为什么 Hooks 逐渐取代 render props

## 🚀 运行项目

```bash
npm install
npm run dev
```

## 💡 核心概念

### Render Props 模式
Render Props 是一种在 React 组件之间共享代码的技术，通过一个值为函数的 prop 来实现。

### 优点
- 逻辑复用
- UI 灵活组合
- 关注点分离

### 缺点
- 嵌套层级深（回调地狱）
- 代码可读性较差
- Hooks 出现后逐渐被取代

### Hooks 替代方案
自定义 Hooks 可以更简洁地实现相同的逻辑复用，代码更清晰、更易维护。

## 📖 思考题

1. 为什么 render props 模式在 Hooks 出现后逐渐被取代？
2. render props 和 children-as-a-function 的区别是什么？
3. 如果一个组件既要提供状态，又要让外部控制渲染方式，还有其他替代方案吗？

