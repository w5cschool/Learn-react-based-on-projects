# 009: Event Bus 事件总线实践

## 学习目标

- 理解事件总线（Event Bus）的设计模式
- 掌握跨组件通信的实现方式
- 学习如何在 React 中实现全局事件系统
- 了解请求/响应模式（RPC）的实现

## 核心概念

### 1. 事件总线（Event Bus）

事件总线是一种发布-订阅（Pub-Sub）模式的实现，允许组件之间进行解耦的通信。

**优势：**
- 跨组件、跨层级通信
- 组件之间无需直接关系
- 解耦组件依赖
- 支持一对多通信

### 2. 核心 API

- `on(event, handler)` - 订阅事件
- `off(event, handler)` - 取消订阅
- `emit(event, detail)` - 发布事件
- `once(event, handler)` - 订阅一次
- `request(event, detail)` - 请求/响应模式

### 3. React Hook 集成

使用 `useEventChat` Hook 可以：
- 自动清理事件监听器
- 防止内存泄漏
- 提供类型安全
- 简化使用方式

## 实践要点

1. **类型安全** - 使用 TypeScript 定义事件数据类型
2. **自动清理** - Hook 在组件卸载时自动清理监听器
3. **命名空间** - 使用命名空间避免事件名称冲突
4. **错误处理** - 在事件处理器中添加错误处理

## 扩展学习

- 观察者模式（Observer Pattern）
- 发布-订阅模式（Pub-Sub Pattern）
- 事件驱动架构（Event-Driven Architecture）
- 状态管理库（Redux, Zustand）的事件机制

