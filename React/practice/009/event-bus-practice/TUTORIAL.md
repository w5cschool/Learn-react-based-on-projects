# 📚 Event Bus 项目思路详解

## 🎯 第一步：理解核心问题

### 问题场景
在 React 中，组件通信通常有几种方式：
1. **Props 传递** - 只能父子组件传递
2. **Context API** - 需要 Provider 包裹，层级深时麻烦
3. **状态管理库** - Redux/Zustand，但太重了

### 我们的目标
创建一个**轻量级、跨组件、跨层级**的通信方案，就像组件间的"聊天室"：
- 组件 A 说："我发了一条消息到频道 'sub-mox'"
- 组件 B、C、D 都能收到，即使它们没有任何关系

---

## 🏗️ 第二步：设计核心架构

### 2.1 发布-订阅模式（Pub-Sub）

这是事件总线的核心设计模式：

```
发布者（Publisher）  →  事件总线（Event Bus）  →  订阅者（Subscriber）
     emit()                   存储监听器              on()
```

**类比理解**：
- 就像微信群：你发消息到群里（emit），所有群成员都能收到（on）
- 事件名 = 群名
- 消息内容 = detail

### 2.2 数据结构设计

我们需要存储：**事件名 → 监听器列表**

```typescript
// 伪代码
{
  "sub-mox": [handler1, handler2, handler3],
  "room:1": [handler4, handler5],
  "room:2": [handler6]
}
```

**为什么用 Map + Set？**
- `Map<string, Set<Handler>>` 
- Map：快速查找事件名
- Set：自动去重，快速添加/删除

---

## 💻 第三步：实现核心 EventBus 类

### 3.1 基础结构

```typescript
class EventBus {
  // 存储：事件名 → 监听器集合
  private events: Map<string, Set<EventHandler>> = new Map();
  
  // 存储：只触发一次的事件
  private onceHandlers: Map<string, Set<EventHandler>> = new Map();
}
```

### 3.2 核心方法：on（订阅）

```typescript
on<T>(event: string, handler: EventHandler<T>): void {
  // 1. 如果这个事件名还没有监听器，创建一个新的 Set
  if (!this.events.has(event)) {
    this.events.set(event, new Set());
  }
  
  // 2. 把 handler 添加到这个事件的监听器集合中
  this.events.get(event)!.add(handler);
}
```

**执行流程**：
```
组件调用 on("sub-mox", handler)
  ↓
EventBus 检查 "sub-mox" 是否已存在
  ↓
不存在 → 创建新的 Set
  ↓
将 handler 添加到 Set 中
```

### 3.3 核心方法：emit（发布）

```typescript
emit<T>(event: string, detail?: T): void {
  // 1. 找到这个事件的所有监听器
  const handlers = this.events.get(event);
  
  // 2. 遍历所有监听器，执行它们
  if (handlers) {
    handlers.forEach((handler) => {
      handler(detail);  // 调用每个监听器
    });
  }
}
```

**执行流程**：
```
组件调用 emit("sub-mox", { name: "test" })
  ↓
EventBus 查找 "sub-mox" 的所有监听器
  ↓
找到 [handler1, handler2, handler3]
  ↓
依次执行：handler1({ name: "test" })
          handler2({ name: "test" })
          handler3({ name: "test" })
```

### 3.4 核心方法：off（取消订阅）

```typescript
off<T>(event: string, handler?: EventHandler<T>): void {
  if (!handler) {
    // 如果没有指定 handler，移除所有监听器
    this.events.delete(event);
    return;
  }
  
  // 移除指定的 handler
  this.events.get(event)?.delete(handler);
}
```

---

## ⚛️ 第四步：React Hook 封装

### 4.1 为什么需要 Hook？

直接使用 EventBus 的问题：
```typescript
// ❌ 问题：组件卸载时，监听器还在，造成内存泄漏
useEffect(() => {
  eventBus.on("my-event", handler);
  // 组件卸载了，但 handler 还在 EventBus 里！
}, []);
```

### 4.2 useEventChat Hook 实现

```typescript
export function useEventChat<T>(
  eventName: string,
  options?: { callback?: (detail?: T) => void }
): [emit: (detail?: T) => void] {
  
  // 1. 订阅事件
  useEffect(() => {
    if (!options?.callback) return;
    
    const handler = options.callback;
    eventBus.on(eventName, handler);
    
    // 2. 清理函数：组件卸载时自动取消订阅
    return () => {
      eventBus.off(eventName, handler);
    };
  }, [eventName]);
  
  // 3. 返回 emit 函数
  const emit = useCallback(
    (detail?: T) => {
      eventBus.emit(eventName, detail);
    },
    [eventName]
  );
  
  return [emit];
}
```

**关键点**：
- ✅ `useEffect` 的清理函数确保组件卸载时自动取消订阅
- ✅ `useCallback` 确保 emit 函数引用稳定
- ✅ 自动处理内存泄漏

---

## 🔄 第五步：完整通信流程

### 5.1 场景：组件 A 发送消息，组件 B 接收

**组件 A（发送者）**：
```typescript
const ComponentA = () => {
  const [emit] = useEventChat("sub-mox");
  
  return (
    <button onClick={() => emit({ name: "hello" })}>
      发送消息
    </button>
  );
};
```

**组件 B（接收者）**：
```typescript
const ComponentB = () => {
  useEventChat("sub-mox", {
    callback: (detail) => {
      console.log("收到消息:", detail);
    }
  });
  
  return <div>我在监听消息</div>;
};
```

### 5.2 执行流程详解

```
1. 组件 B 挂载
   ↓
   useEventChat 执行
   ↓
   eventBus.on("sub-mox", handler) 被调用
   ↓
   EventBus 内部：events.set("sub-mox", new Set([handler]))

2. 用户点击组件 A 的按钮
   ↓
   emit({ name: "hello" }) 被调用
   ↓
   eventBus.emit("sub-mox", { name: "hello" }) 被调用
   ↓
   EventBus 查找 events.get("sub-mox")
   ↓
   找到 Set([handler])
   ↓
   执行 handler({ name: "hello" })
   ↓
   组件 B 的 callback 被调用
   ↓
   console.log("收到消息:", { name: "hello" })

3. 组件 B 卸载
   ↓
   useEffect 的清理函数执行
   ↓
   eventBus.off("sub-mox", handler) 被调用
   ↓
   EventBus 内部：events.get("sub-mox").delete(handler)
   ↓
   监听器被移除，无内存泄漏
```

---

## 🚀 第六步：高级功能

### 6.1 Once 事件（只触发一次）

**需求**：有些事件只需要处理一次，比如"初始化完成"

**实现思路**：
```typescript
// 单独存储 once 监听器
private onceHandlers: Map<string, Set<EventHandler>> = new Map();

once(event: string, handler: EventHandler): void {
  // 存储到 onceHandlers
  this.onceHandlers.get(event)?.add(handler);
}

emit(event: string, detail?: any): void {
  // 1. 执行普通监听器
  this.events.get(event)?.forEach(handler => handler(detail));
  
  // 2. 执行 once 监听器
  const onceHandlers = this.onceHandlers.get(event);
  if (onceHandlers) {
    onceHandlers.forEach(handler => handler(detail));
    // 3. 执行完后立即删除
    this.onceHandlers.delete(event);
  }
}
```

### 6.2 请求/响应模式（RPC）

**需求**：像函数调用一样，发送请求并等待响应

**实现思路**：
```typescript
// 1. 发送请求时，生成唯一 ID
const requestId = `${event}:${Date.now()}:${Math.random()}`;
const responseEvent = `${event}:response:${requestId}`;

// 2. 创建一个 Promise，等待响应
const promise = new Promise((resolve, reject) => {
  // 存储 Promise 的 resolve/reject
  this.pendingRequests.set(requestId, { resolve, reject });
  
  // 监听响应事件
  this.once(responseEvent, (response) => {
    resolve(response);
  });
});

// 3. 发送请求（携带 requestId）
this.emit(event, { ...detail, _requestId: requestId });

// 4. 响应方处理请求并发送响应
this.on(event, (detail) => {
  const { _requestId, ...data } = detail;
  const response = await handler(data);
  this.emit(`${event}:response:${_requestId}`, response);
});
```

---

## 📊 第七步：项目文件结构

```
src/
├── eventBus.ts              # 核心：EventBus 类
├── hooks/
│   └── useEventChat.ts      # React Hook 封装
├── components/
│   ├── SubMox.tsx           # 示例：基础用法
│   ├── RandomComponent.tsx # 示例：跨组件通信
│   ├── ChatRoom.tsx         # 示例：命名空间
│   ├── RequestResponseDemo.tsx # 示例：RPC 模式
│   └── OnceDemo.tsx         # 示例：Once 事件
└── App.tsx                  # 主应用
```

---

## 🎓 第八步：学习要点总结

### 8.1 核心概念
1. **发布-订阅模式**：解耦发送者和接收者
2. **Map + Set 数据结构**：高效存储和查找
3. **React Hook 封装**：自动清理，防止内存泄漏

### 8.2 关键技巧
1. **useEffect 清理函数**：确保组件卸载时取消订阅
2. **useCallback**：稳定函数引用，避免不必要的重渲染
3. **useRef**：保存最新的 callback，避免闭包陷阱

### 8.3 设计模式
- **单例模式**：EventBus 全局只有一个实例
- **观察者模式**：组件观察事件变化
- **中介者模式**：EventBus 作为组件间的中介

---

## 🔍 第九步：常见问题

### Q1: 为什么用 Set 而不是 Array？
**A**: Set 自动去重，避免重复添加同一个 handler

### Q2: 为什么需要 onceHandlers？
**A**: 因为 once 事件执行后要立即删除，需要单独管理

### Q3: 如何避免内存泄漏？
**A**: 
- Hook 中使用 useEffect 的清理函数
- 组件卸载时自动调用 eventBus.off()

### Q4: 命名空间有什么用？
**A**: 避免事件名冲突，比如 `room:1` 和 `room:2` 互不干扰

---

## 🎯 第十步：扩展思考

### 可以继续优化的方向：
1. **事件优先级**：某些事件需要优先处理
2. **事件拦截器**：在事件执行前/后添加逻辑
3. **事件历史记录**：记录所有事件，用于调试
4. **类型安全增强**：使用 TypeScript 的模板字面量类型
5. **性能优化**：大量事件时的性能优化

---

## 📝 实践建议

1. **先理解基础**：on、emit、off 三个核心方法
2. **再看 Hook**：理解如何封装成 React Hook
3. **最后看示例**：通过实际组件理解用法
4. **动手实践**：自己写一个简单的 EventBus
5. **扩展功能**：尝试实现 once、request/response 等功能

---

希望这个教程能帮助你理解 Event Bus 的设计思路！🚀

