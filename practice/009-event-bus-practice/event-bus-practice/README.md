# 🚀 Event Bus 事件总线实践

一个专业、现代、类型安全的 React 事件总线实现，支持跨组件、跨层级、无关系组件之间的通信。

## ✨ 特性

- ✅ **跨组件通信** - 任意组件之间可以收发消息，无需父子关系
- ✅ **类型安全** - 完整的 TypeScript 支持
- ✅ **自动清理** - React Hook 自动处理事件监听器的清理，防止内存泄漏
- ✅ **命名空间支持** - 支持事件命名空间（如 `room:1`, `room:2`）
- ✅ **Once 事件** - 支持只触发一次的事件监听
- ✅ **离线消息队列** - 消息队列机制，支持离线消息
- ✅ **请求/响应模式** - 类似 RPC 的请求/响应模式
- ✅ **异步支持** - 支持异步事件处理器
- ✅ **调试日志** - 开发环境自动启用详细日志
- ✅ **Promise 支持** - 支持 Promise 请求/响应模型

## 📦 安装

```bash
npm install
```

## 🚀 运行

```bash
npm run dev
```

## 📖 使用方法

### 1. 基础用法：跨组件通信

```tsx
import { useEventChat } from './hooks/useEventChat';

// 组件 A：发送消息
const ComponentA = () => {
  const [emit] = useEventChat("my-event", {
    callback: (detail) => console.log("收到消息:", detail),
  });

  return (
    <button onClick={() => emit({ name: "test" })}>
      发送消息
    </button>
  );
};

// 组件 B：接收消息（无需任何关系）
const ComponentB = () => {
  useEventChat("my-event", {
    callback: (detail) => console.log("ComponentB 也收到:", detail),
  });

  return <div>我在任何地方都能收到消息</div>;
};
```

### 2. 命名空间聊天室

```tsx
import { useEventChat } from './hooks/useEventChat';

const ChatRoom = ({ roomId }: { roomId: string }) => {
  const [emit] = useEventChat(`room:${roomId}`, {
    callback: (msg) => {
      console.log(`房间 ${roomId} 收到消息:`, msg);
    },
  });

  return (
    <button onClick={() => emit({ user: "Alice", message: "Hello!" })}>
      发送到房间 {roomId}
    </button>
  );
};

// 不同房间互不干扰
<ChatRoom roomId="1" />
<ChatRoom roomId="2" />
```

### 3. Once 事件（只触发一次）

```tsx
import { useEventChat } from './hooks/useEventChat';

const Component = () => {
  useEventChat("once-event", {
    callback: () => console.log("这只会执行一次"),
    once: true, // 关键：只触发一次
  });

  return <div>...</div>;
};
```

### 4. 请求/响应模式（RPC）

```tsx
import { useEventRequest, useEventRespond } from './hooks/useEventChat';

// 服务端：响应请求
const ServerComponent = () => {
  useEventRespond("getUser", async ({ id }) => {
    // 模拟 API 调用
    return {
      id,
      name: `用户 ${id}`,
      email: `user${id}@example.com`,
    };
  });

  return <div>服务端组件</div>;
};

// 客户端：发送请求
const ClientComponent = () => {
  const requestUser = useEventRequest<{ id: number }, User>("getUser");

  const handleRequest = async () => {
    try {
      const user = await requestUser({ id: 123 });
      console.log("收到用户:", user);
    } catch (error) {
      console.error("请求失败:", error);
    }
  };

  return <button onClick={handleRequest}>获取用户</button>;
};
```

### 5. 直接使用 EventBus API

```tsx
import { eventBus } from './eventBus';

// 订阅事件
eventBus.on("my-event", (detail) => {
  console.log("收到:", detail);
});

// 发布事件
eventBus.emit("my-event", { data: "test" });

// 订阅一次
eventBus.once("my-event", (detail) => {
  console.log("只触发一次:", detail);
});

// 异步发布
await eventBus.emitAsync("my-event", { data: "test" });

// 请求/响应
const response = await eventBus.request("getUser", { id: 123 });

// 响应请求
eventBus.respond("getUser", async ({ id }) => {
  return await fetchUser(id);
});
```

## 🎯 API 文档

### EventBus 类

#### `on<T>(event: string, handler: EventHandler<T>): void`
订阅事件

#### `off<T>(event: string, handler?: EventHandler<T>): void`
取消订阅事件（如果不提供 handler，则移除所有监听器）

#### `once<T>(event: string, handler: EventHandler<T>): void`
订阅事件（仅触发一次）

#### `emit<T>(event: string, detail?: T): void`
发布事件

#### `emitAsync<T>(event: string, detail?: T): Promise<void>`
异步发布事件（等待所有异步处理器完成）

#### `request<TRequest, TResponse>(event: string, detail?: TRequest, timeout?: number): Promise<TResponse>`
发送请求并等待响应（类似 RPC）

#### `respond<TRequest, TResponse>(event: string, handler: (detail?: TRequest) => TResponse | Promise<TResponse>): void`
响应请求

#### `clear(): void`
清除所有事件监听器

#### `listenerCount(event?: string): number`
获取事件监听器数量

#### `eventNames(): string[]`
获取所有事件名称

### useEventChat Hook

```tsx
const [emit] = useEventChat<T>(eventName: string, options?: {
  callback?: (detail?: T) => void;
  once?: boolean;
  enabled?: boolean;
});
```

### useEventChatAsync Hook

```tsx
const [emitAsync] = useEventChatAsync<T>(eventName: string, options?: {
  callback?: (detail?: T) => Promise<void>;
  once?: boolean;
  enabled?: boolean;
});
```

### useEventRequest Hook

```tsx
const request = useEventRequest<TRequest, TResponse>(
  eventName: string,
  timeout?: number
);
```

### useEventRespond Hook

```tsx
useEventRespond<TRequest, TResponse>(
  eventName: string,
  handler: (detail?: TRequest) => TResponse | Promise<TResponse>,
  enabled?: boolean
);
```

## 🔧 配置

创建自定义 EventBus 实例：

```tsx
import { EventBus } from './eventBus';

const customBus = new EventBus({
  debug: true,           // 启用调试日志
  namespace: true,       // 启用命名空间支持
  maxQueueSize: 100,     // 最大队列长度
});
```

## 💡 最佳实践

1. **使用 Hook** - 在 React 组件中优先使用 `useEventChat` Hook，它会自动处理清理
2. **类型安全** - 为事件数据定义 TypeScript 类型
3. **命名空间** - 使用命名空间避免事件名称冲突（如 `module:action`）
4. **清理监听器** - 如果直接使用 `eventBus.on`，记得在组件卸载时调用 `eventBus.off`
5. **错误处理** - 在事件处理器中添加 try-catch 处理错误

## 🎨 示例

查看 `src/components/` 目录下的示例组件：

- `SubMox.tsx` - 基础用法
- `RandomComponent.tsx` - 跨组件通信
- `ChatRoom.tsx` - 命名空间聊天室
- `RequestResponseDemo.tsx` - 请求/响应模式
- `OnceDemo.tsx` - Once 事件

## 📝 许可证

MIT

