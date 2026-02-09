# 💻 代码逐行解析

## 1. EventBus 核心类 - 简化版解析

```typescript
class EventBus {
  // ============================================
  // 第一步：定义数据结构
  // ============================================
  
  // Map：键是事件名（字符串），值是监听器集合（Set）
  // 为什么用 Set？因为 Set 可以自动去重，避免重复添加同一个 handler
  private events: Map<string, Set<EventHandler>> = new Map();
  
  // ============================================
  // 第二步：实现 on 方法（订阅）
  // ============================================
  
  on<T>(event: string, handler: EventHandler<T>): void {
    // 1. 检查这个事件名是否已经有监听器了
    if (!this.events.has(event)) {
      // 2. 如果没有，创建一个新的 Set 来存储监听器
      this.events.set(event, new Set());
    }
    
    // 3. 把 handler 添加到这个事件的监听器集合中
    // ! 表示"我确定这个值存在"（TypeScript 语法）
    this.events.get(event)!.add(handler);
    
    // 执行后的数据结构示例：
    // events = {
    //   "sub-mox" => Set([handler1, handler2])
    // }
  }
  
  // ============================================
  // 第三步：实现 emit 方法（发布）
  // ============================================
  
  emit<T>(event: string, detail?: T): void {
    // 1. 找到这个事件的所有监听器
    const handlers = this.events.get(event);
    
    // 2. 如果存在监听器，遍历并执行它们
    if (handlers) {
      handlers.forEach((handler) => {
        // 3. 调用每个监听器，传入消息内容
        handler(detail);
      });
    }
    
    // 执行流程示例：
    // emit("sub-mox", { name: "hello" })
    //   → handlers = Set([handler1, handler2])
    //   → handler1({ name: "hello" })
    //   → handler2({ name: "hello" })
  }
  
  // ============================================
  // 第四步：实现 off 方法（取消订阅）
  // ============================================
  
  off<T>(event: string, handler?: EventHandler<T>): void {
    // 情况1：没有指定 handler，移除所有监听器
    if (!handler) {
      this.events.delete(event);
      return;
    }
    
    // 情况2：移除指定的 handler
    // ?. 是可选链，如果 events.get(event) 是 undefined，不会报错
    this.events.get(event)?.delete(handler);
    
    // 执行后的数据结构示例：
    // 移除前：events = { "sub-mox" => Set([handler1, handler2]) }
    // 移除后：events = { "sub-mox" => Set([handler2]) }
  }
}
```

---

## 2. useEventChat Hook - 详细解析

```typescript
export function useEventChat<T>(
  eventName: string,  // 事件名，比如 "sub-mox"
  options?: {         // 可选配置
    callback?: (detail?: T) => void;  // 收到消息时的回调函数
    once?: boolean;   // 是否只触发一次
    enabled?: boolean; // 是否启用（默认 true）
  }
): [emit: (detail?: T) => void] {  // 返回一个数组，包含 emit 函数
  
  // ============================================
  // 第一步：解构配置参数
  // ============================================
  const { callback, once = false, enabled = true } = options || {};
  
  // ============================================
  // 第二步：使用 useRef 保存 callback
  // ============================================
  // 为什么用 useRef？
  // 因为 callback 可能会变化，但我们希望 handler 始终使用最新的 callback
  const callbackRef = useRef(callback);
  
  // 当 callback 变化时，更新 ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // ============================================
  // 第三步：使用 useRef 保存 handler
  // ============================================
  // 这个 ref 用于在清理时找到正确的 handler
  const handlerRef = useRef<EventHandler<T> | null>(null);
  
  // ============================================
  // 第四步：订阅事件（核心逻辑）
  // ============================================
  useEffect(() => {
    // 1. 如果未启用或没有 callback，不订阅
    if (!enabled || !callback) {
      handlerRef.current = null;
      return;
    }
    
    // 2. 创建一个 handler 函数
    // 这个 handler 会调用最新的 callback
    const handler: EventHandler<T> = (detail) => {
      callbackRef.current?.(detail);  // ?. 表示如果存在才调用
    };
    
    // 3. 保存 handler 到 ref，用于后续清理
    handlerRef.current = handler;
    
    // 4. 根据 once 参数决定使用 on 还是 once
    if (once) {
      eventBus.once(eventName, handler);
    } else {
      eventBus.on(eventName, handler);
    }
    
    // 5. 清理函数：组件卸载时自动取消订阅
    // 这是防止内存泄漏的关键！
    return () => {
      if (handlerRef.current) {
        eventBus.off(eventName, handlerRef.current);
      }
    };
  }, [eventName, once, enabled]);  // 依赖项：这些变化时重新订阅
  
  // ============================================
  // 第五步：创建 emit 函数
  // ============================================
  // 使用 useCallback 确保函数引用稳定
  const emit = useCallback(
    (detail?: T) => {
      eventBus.emit(eventName, detail);
    },
    [eventName]  // 只有 eventName 变化时才重新创建函数
  );
  
  // ============================================
  // 第六步：返回 emit 函数
  // ============================================
  return [emit] as const;  // as const 表示这是一个只读数组
}
```

---

## 3. 使用示例 - 逐步解析

### 示例1：基础用法

```typescript
// ============================================
// 组件 A：发送消息
// ============================================
const ComponentA = () => {
  // 1. 调用 useEventChat，传入事件名
  // 2. 返回 [emit] 函数，用解构赋值获取
  const [emit] = useEventChat("sub-mox");
  
  return (
    <button 
      onClick={() => {
        // 3. 点击按钮时，调用 emit 发送消息
        emit({ name: "pub-mox", timestamp: Date.now() });
      }}
    >
      发送消息
    </button>
  );
};

// ============================================
// 组件 B：接收消息
// ============================================
const ComponentB = () => {
  // 1. 调用 useEventChat，传入事件名和回调函数
  useEventChat("sub-mox", {
    callback: (detail) => {
      // 2. 当收到消息时，这个回调函数会被执行
      console.log("收到消息:", detail);
      // detail = { name: "pub-mox", timestamp: 1234567890 }
    }
  });
  
  return <div>我在监听消息</div>;
};
```

### 执行流程：

```
1. 组件 B 挂载
   ↓
   useEventChat("sub-mox", { callback: ... })
   ↓
   useEffect 执行
   ↓
   eventBus.on("sub-mox", handler)
   ↓
   EventBus 存储：events.set("sub-mox", Set([handler]))

2. 用户点击组件 A 的按钮
   ↓
   emit({ name: "pub-mox", timestamp: ... })
   ↓
   eventBus.emit("sub-mox", { name: "pub-mox", ... })
   ↓
   EventBus 查找：events.get("sub-mox")
   ↓
   找到 Set([handler])
   ↓
   执行：handler({ name: "pub-mox", ... })
   ↓
   组件 B 的 callback 被调用
   ↓
   console.log("收到消息:", { name: "pub-mox", ... })

3. 组件 B 卸载
   ↓
   useEffect 清理函数执行
   ↓
   eventBus.off("sub-mox", handler)
   ↓
   EventBus 移除：events.get("sub-mox").delete(handler)
```

---

## 4. 关键概念解释

### 4.1 为什么用 Map + Set？

```typescript
// Map：快速查找
// 时间复杂度：O(1)
events.get("sub-mox")  // 立即找到

// Set：自动去重，快速添加/删除
// 时间复杂度：O(1)
handlers.add(handler)  // 立即添加
handlers.delete(handler)  // 立即删除
```

### 4.2 为什么用 useRef？

```typescript
// 问题：callback 可能会变化
const callback = () => console.log("old");

// 如果直接使用 callback，会有闭包问题
useEffect(() => {
  eventBus.on("event", callback);  // 这里保存的是旧的 callback
}, []);

// 解决：用 useRef 保存最新的 callback
const callbackRef = useRef(callback);
useEffect(() => {
  callbackRef.current = callback;  // 始终更新为最新的
}, [callback]);

useEffect(() => {
  const handler = () => callbackRef.current?.();  // 使用最新的
  eventBus.on("event", handler);
}, []);
```

### 4.3 为什么用 useCallback？

```typescript
// 问题：每次渲染都会创建新的函数
const emit = (detail) => eventBus.emit(eventName, detail);
// 这会导致依赖这个函数的组件重新渲染

// 解决：用 useCallback 缓存函数
const emit = useCallback(
  (detail) => eventBus.emit(eventName, detail),
  [eventName]  // 只有 eventName 变化时才重新创建
);
```

---

## 5. 常见错误和正确做法

### ❌ 错误1：忘记清理

```typescript
// 错误：组件卸载后，handler 还在 EventBus 里
useEffect(() => {
  eventBus.on("event", handler);
  // 缺少清理函数！
}, []);
```

### ✅ 正确：自动清理

```typescript
// 正确：组件卸载时自动清理
useEffect(() => {
  eventBus.on("event", handler);
  return () => {
    eventBus.off("event", handler);
  };
}, []);
```

### ❌ 错误2：闭包陷阱

```typescript
// 错误：handler 捕获的是旧的 state
const [count, setCount] = useState(0);
useEffect(() => {
  const handler = () => {
    console.log(count);  // 永远是初始值 0
  };
  eventBus.on("event", handler);
}, []);
```

### ✅ 正确：使用 ref

```typescript
// 正确：使用 ref 保存最新的值
const countRef = useRef(0);
useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  const handler = () => {
    console.log(countRef.current);  // 始终是最新的值
  };
  eventBus.on("event", handler);
}, []);
```

---

这些注释帮助你理解每一行代码的作用和设计思路！🚀

