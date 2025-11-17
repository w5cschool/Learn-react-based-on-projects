# 💾 Event Bus 内存存储详解

## 问题1：Map 会不会变得很大？

### 答案：理论上会，但实际应用中通常没问题

### 内存占用分析

```typescript
// EventBus 内部结构
Map {
  "event1" → Set([handler1, handler2, handler3]),
  "event2" → Set([handler4, handler5]),
  // ... 更多事件
}
```

**内存占用 = 事件数量 × 平均每个事件的 handler 数量**

### 实际场景估算

假设：
- 100 个事件
- 每个事件平均 5 个 handler
- 每个函数引用约 8 字节（64位系统）

```
总内存 ≈ 100 × 5 × 8 字节 = 4000 字节 ≈ 4KB
```

**结论**：即使有大量事件，内存占用也很小。

### 什么时候会有问题？

1. **内存泄漏**：组件卸载后没有清理 handler
   ```typescript
   // ❌ 错误：没有清理
   useEffect(() => {
     eventBus.on("event", handler);
     // 组件卸载了，但 handler 还在 Map 里
   }, []);
   
   // ✅ 正确：自动清理
   useEventChat("event", { callback: handler });
   // Hook 会自动清理
   ```

2. **大量长期订阅**：数千个组件同时订阅
   - 这种情况需要优化架构
   - 考虑使用事件池或懒加载

### 优化方案

如果确实遇到内存问题，可以考虑：

```typescript
// 1. 限制事件数量
class EventBus {
  private maxEvents = 1000;
  
  on(event: string, handler: EventHandler) {
    if (this.events.size >= this.maxEvents) {
      console.warn("事件数量过多，请清理不需要的事件");
    }
    // ...
  }
}

// 2. 定期清理未使用的事件
clearUnusedEvents() {
  // 清理没有监听器的事件
  for (const [event, handlers] of this.events.entries()) {
    if (handlers.size === 0) {
      this.events.delete(event);
    }
  }
}
```

---

## 问题2：存的是引用还是函数本身？

### 答案：存的是函数引用（Reference）

### JavaScript 函数存储机制

在 JavaScript 中：
- **函数是对象**
- **存储的是引用，不是复制**
- **多个变量可以指向同一个函数**

### 代码验证

```typescript
// 创建一个函数
const myHandler = (data) => console.log(data);

// 存储到 EventBus
eventBus.on("my-event", myHandler);

// 验证：存储的是引用
const handlers = eventBus.events.get("my-event");
console.log(handlers.has(myHandler));  // true
console.log(handlers.values().next().value === myHandler);  // true
// ↑ 这说明存储的就是同一个函数对象
```

### 内存结构示意

```
┌─────────────────────────────────────┐
│         JavaScript 堆内存            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  函数对象 (handler)          │   │
│  │  {                           │   │
│  │    code: "console.log(...)", │   │
│  │    scope: {...}             │   │
│  │  }                          │   │
│  └─────────────────────────────┘   │
│           ↑                         │
│           │ 引用                     │
│           │                         │
└───────────┼─────────────────────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼────┐    ┌──────▼──────┐
│ 变量   │    │  EventBus   │
│handler │    │   Map       │
└────────┘    └─────────────┘
```

### 实际例子

```typescript
// 1. 创建函数
const handler1 = (data) => console.log("Handler 1:", data);
const handler2 = (data) => console.log("Handler 2:", data);

// 2. 存储到 EventBus
eventBus.on("event", handler1);
eventBus.on("event", handler2);

// 3. 内存中只有两个函数对象
// EventBus 的 Map 中存储的是这两个函数对象的引用

// 4. 如果修改 handler1（比如添加属性）
handler1.customProp = "test";

// 5. 从 EventBus 中取出的 handler 也有这个属性
const handlers = eventBus.events.get("event");
handlers.forEach(h => {
  if (h === handler1) {
    console.log(h.customProp);  // "test"
  }
});
```

### 为什么用引用而不是复制？

**优点**：
1. **节省内存**：多个地方引用同一个函数，不重复存储
2. **性能好**：引用比较和传递很快
3. **一致性**：所有引用指向同一个函数对象

**缺点**：
1. **需要注意清理**：如果函数被多个地方引用，需要确保都清理

### Set 如何比较函数？

```typescript
const handler1 = () => console.log("1");
const handler2 = () => console.log("2");
const handler3 = handler1;  // 同一个引用

const handlers = new Set();
handlers.add(handler1);
handlers.add(handler2);
handlers.add(handler3);  // 不会添加，因为 handler3 === handler1

console.log(handlers.size);  // 2（不是 3）
```

**Set 使用 `===` 比较**：
- 相同引用的函数会被去重
- 不同函数（即使代码相同）会被视为不同

### 实际影响

```typescript
// 场景1：同一个函数多次订阅
const handler = () => console.log("test");

eventBus.on("event", handler);
eventBus.on("event", handler);  // 会被 Set 去重
eventBus.on("event", handler);  // 会被 Set 去重

// EventBus 中只存储一个 handler 引用

// 场景2：每次创建新函数
eventBus.on("event", () => console.log("test1"));
eventBus.on("event", () => console.log("test2"));
eventBus.on("event", () => console.log("test3"));

// EventBus 中存储三个不同的函数引用
// 即使代码相同，也是不同的函数对象
```

---

## 总结

### 问题1：Map 会不会很大？
- **理论上会**，但实际应用中通常很小（几KB到几十KB）
- **关键**：确保组件卸载时清理 handler（Hook 已自动处理）
- **优化**：如果确实有问题，可以限制事件数量或定期清理

### 问题2：存的是引用还是函数？
- **存的是引用**（函数对象的引用）
- **优点**：节省内存，性能好
- **注意**：Set 会自动去重相同引用的函数

### 最佳实践

```typescript
// ✅ 使用 Hook，自动清理
useEventChat("event", { callback: handler });

// ✅ 如果直接使用 EventBus，记得清理
useEffect(() => {
  eventBus.on("event", handler);
  return () => eventBus.off("event", handler);
}, []);

// ❌ 避免：创建大量匿名函数
// 每次渲染都创建新函数，无法去重
useEffect(() => {
  eventBus.on("event", () => console.log("test"));
  // 这个匿名函数每次都是新的，无法清理
}, []);
```

---

**记住**：
- 函数存储的是引用，不是复制
- 合理使用不会有大问题
- 关键是确保清理，避免内存泄漏

