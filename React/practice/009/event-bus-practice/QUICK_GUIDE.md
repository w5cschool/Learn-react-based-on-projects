# 🚀 Event Bus 快速理解指南

## 📌 一句话理解

**Event Bus = 组件间的"微信群"**
- 你发消息到群里（emit）
- 所有群成员都能收到（on）
- 可以退群（off）

---

## 🎯 核心思路（3步）

### 第1步：存储结构
```
事件名 → 监听器列表

"sub-mox" → [handler1, handler2, handler3]
"room:1"  → [handler4, handler5]
```

### 第2步：三个核心方法

#### 📤 emit（发布/发送）
```typescript
emit("sub-mox", { name: "hello" })
  ↓
找到 "sub-mox" 的所有监听器
  ↓
依次执行每个监听器
```

#### 📥 on（订阅/接收）
```typescript
on("sub-mox", handler)
  ↓
把 handler 添加到 "sub-mox" 的监听器列表
```

#### ❌ off（取消订阅）
```typescript
off("sub-mox", handler)
  ↓
从 "sub-mox" 的监听器列表中移除 handler
```

### 第3步：React Hook 封装
```typescript
useEventChat("sub-mox", { callback: handler })
  ↓
组件挂载时：on("sub-mox", handler)
组件卸载时：off("sub-mox", handler)  ← 自动清理！
```

---

## 🔄 完整流程示例

### 场景：组件A发消息，组件B收消息

```
┌─────────────┐
│  组件 A     │
│  (发送者)    │
└──────┬──────┘
       │ emit("sub-mox", data)
       ↓
┌──────────────────┐
│   EventBus       │
│                  │
│  "sub-mox" →     │
│    [handler1,    │
│     handler2]    │
└──────┬───────────┘
       │ 执行所有监听器
       ↓
┌─────────────┐
│  组件 B     │
│  (接收者)    │
│  handler1()│
└─────────────┘
```

---

## 💡 关键代码解析

### 1. EventBus 核心类

```typescript
class EventBus {
  // 存储：事件名 → 监听器集合
  private events = new Map<string, Set<Handler>>();
  
  // 订阅
  on(event: string, handler: Handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }
  
  // 发布
  emit(event: string, detail?: any) {
    const handlers = this.events.get(event);
    handlers?.forEach(handler => handler(detail));
  }
  
  // 取消订阅
  off(event: string, handler?: Handler) {
    if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler);
    }
  }
}
```

### 2. React Hook 封装

```typescript
function useEventChat(eventName, { callback }) {
  useEffect(() => {
    if (!callback) return;
    
    // 订阅
    eventBus.on(eventName, callback);
    
    // 清理：组件卸载时自动取消订阅
    return () => {
      eventBus.off(eventName, callback);
    };
  }, [eventName, callback]);
  
  // 返回发送函数
  const emit = useCallback(
    (detail) => eventBus.emit(eventName, detail),
    [eventName]
  );
  
  return [emit];
}
```

---

## 🎨 使用示例

### 基础用法

```typescript
// 组件 A：发送消息
const ComponentA = () => {
  const [emit] = useEventChat("my-event");
  
  return (
    <button onClick={() => emit({ msg: "hello" })}>
      发送
    </button>
  );
};

// 组件 B：接收消息
const ComponentB = () => {
  useEventChat("my-event", {
    callback: (detail) => {
      console.log("收到:", detail);
    }
  });
  
  return <div>监听中...</div>;
};
```

---

## 🧠 记忆要点

1. **Map + Set** = 高效存储
2. **on/emit/off** = 订阅/发布/取消
3. **useEffect 清理** = 防止内存泄漏
4. **useCallback** = 稳定函数引用

---

## ❓ 常见疑问

**Q: 为什么需要 EventBus？**
A: 让没有关系的组件也能通信，不需要 props 层层传递

**Q: 会内存泄漏吗？**
A: 不会！Hook 会在组件卸载时自动清理

**Q: 和 Redux 有什么区别？**
A: EventBus 更轻量，只负责通信，不管理状态

---

## 📚 学习路径

1. ✅ 理解 Map + Set 数据结构
2. ✅ 理解 on/emit/off 三个方法
3. ✅ 理解 React Hook 封装
4. ✅ 看示例代码
5. ✅ 自己动手实现一个简化版

---

**记住：Event Bus = 组件间的微信群！** 🎉

