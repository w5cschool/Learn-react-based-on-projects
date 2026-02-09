/**
 * 专业的事件总线（Event Bus）实现
 * 支持跨组件、跨层级、无关系组件之间的通信
 */

type EventHandler<T = any> = (detail?: T) => void | Promise<void>;
type EventHandlerOnce<T = any> = EventHandler<T> & { once?: boolean };

interface EventBusOptions {
  /** 是否启用调试日志 */
  debug?: boolean;
  /** 是否启用命名空间支持 */
  namespace?: boolean;
  /** 最大队列长度（用于离线消息） */
  maxQueueSize?: number;
}

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timeout: NodeJS.Timeout;
}

class EventBus {
  private events: Map<string, Set<EventHandler>> = new Map();
  private onceHandlers: Map<string, Set<EventHandler>> = new Map();
  private messageQueue: Map<string, any[]> = new Map();
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private options: Required<EventBusOptions>;

  constructor(options: EventBusOptions = {}) {
    this.options = {
      debug: options.debug ?? false,
      namespace: options.namespace ?? true,
      maxQueueSize: options.maxQueueSize ?? 100,
    };
  }

  /**
   * 规范化事件名称（支持命名空间）
   */
  private normalizeEventName(event: string): string {
    if (!this.options.namespace) return event;
    // 支持命名空间，例如 "room:1" -> "room:1"
    return event;
  }

  /**
   * 日志输出
   */
  private log(level: 'info' | 'warn' | 'error', message: string, ...args: any[]) {
    if (this.options.debug) {
      const prefix = `[EventBus:${level.toUpperCase()}]`;
      console[level](prefix, message, ...args);
    }
  }

  /**
   * 订阅事件
   */
  on<T = any>(event: string, handler: EventHandler<T>): void {
    const normalizedEvent = this.normalizeEventName(event);
    
    if (!this.events.has(normalizedEvent)) {
      this.events.set(normalizedEvent, new Set());
    }
    
    this.events.get(normalizedEvent)!.add(handler);
    this.log('info', `订阅事件: ${normalizedEvent}`, { handlerCount: this.events.get(normalizedEvent)!.size });

    // 处理离线消息队列
    this.processQueue(normalizedEvent);
  }

  /**
   * 取消订阅事件
   */
  off<T = any>(event: string, handler?: EventHandler<T>): void {
    const normalizedEvent = this.normalizeEventName(event);
    
    if (!handler) {
      // 如果没有指定 handler，移除所有监听器
      this.events.delete(normalizedEvent);
      this.onceHandlers.delete(normalizedEvent);
      this.messageQueue.delete(normalizedEvent);
      this.log('info', `移除所有监听器: ${normalizedEvent}`);
      return;
    }

    this.events.get(normalizedEvent)?.delete(handler);
    this.onceHandlers.get(normalizedEvent)?.delete(handler);
    this.log('info', `取消订阅: ${normalizedEvent}`);
  }

  /**
   * 订阅事件（仅触发一次）
   */
  once<T = any>(event: string, handler: EventHandler<T>): void {
    const normalizedEvent = this.normalizeEventName(event);
    
    if (!this.onceHandlers.has(normalizedEvent)) {
      this.onceHandlers.set(normalizedEvent, new Set());
    }
    
    this.onceHandlers.get(normalizedEvent)!.add(handler);
    this.log('info', `订阅事件（仅一次）: ${normalizedEvent}`);
  }

  /**
   * 发布事件
   */
  emit<T = any>(event: string, detail?: T): void {
    const normalizedEvent = this.normalizeEventName(event);
    
    this.log('info', `发布事件: ${normalizedEvent}`, detail);

    // 触发普通监听器
    const handlers = this.events.get(normalizedEvent);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(detail);
        } catch (error) {
          this.log('error', `事件处理器执行错误: ${normalizedEvent}`, error);
        }
      });
    }

    // 触发 once 监听器并移除
    const onceHandlers = this.onceHandlers.get(normalizedEvent);
    if (onceHandlers) {
      onceHandlers.forEach((handler) => {
        try {
          handler(detail);
        } catch (error) {
          this.log('error', `事件处理器执行错误（once）: ${normalizedEvent}`, error);
        }
      });
      this.onceHandlers.delete(normalizedEvent);
    }

    // 如果没有监听器，将消息加入队列（离线消息）
    if ((!handlers || handlers.size === 0) && (!onceHandlers || onceHandlers.size === 0)) {
      this.enqueueMessage(normalizedEvent, detail);
    }
  }

  /**
   * 异步发布事件（支持 Promise）
   */
  async emitAsync<T = any>(event: string, detail?: T): Promise<void> {
    const normalizedEvent = this.normalizeEventName(event);
    
    this.log('info', `异步发布事件: ${normalizedEvent}`, detail);

    const handlers = this.events.get(normalizedEvent);
    if (handlers) {
      await Promise.all(
        Array.from(handlers).map(async (handler) => {
          try {
            await handler(detail);
          } catch (error) {
            this.log('error', `异步事件处理器执行错误: ${normalizedEvent}`, error);
          }
        })
      );
    }

    const onceHandlers = this.onceHandlers.get(normalizedEvent);
    if (onceHandlers) {
      await Promise.all(
        Array.from(onceHandlers).map(async (handler) => {
          try {
            await handler(detail);
          } catch (error) {
            this.log('error', `异步事件处理器执行错误（once）: ${normalizedEvent}`, error);
          }
        })
      );
      this.onceHandlers.delete(normalizedEvent);
    }
  }

  /**
   * 请求/响应模式（类似 RPC）
   */
  request<TRequest = any, TResponse = any>(
    event: string,
    detail?: TRequest,
    timeout: number = 5000
  ): Promise<TResponse> {
    const normalizedEvent = this.normalizeEventName(event);
    const requestId = `${normalizedEvent}:${Date.now()}:${Math.random()}`;
    const responseEvent = `${normalizedEvent}:response:${requestId}`;

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`请求超时: ${normalizedEvent}`));
      }, timeout);

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        timeout: timeoutId,
      });

      // 监听响应
      this.once<TResponse>(responseEvent, (response) => {
        const pending = this.pendingRequests.get(requestId);
        if (pending) {
          clearTimeout(pending.timeout);
          this.pendingRequests.delete(requestId);
          pending.resolve(response);
        }
      });

      // 发送请求（携带 requestId）
      this.emit(normalizedEvent, { ...detail, _requestId: requestId });
    });
  }

  /**
   * 响应请求
   */
  respond<TRequest = any, TResponse = any>(
    event: string,
    handler: (detail?: TRequest) => TResponse | Promise<TResponse>
  ): void {
    const normalizedEvent = this.normalizeEventName(event);
    
    this.on<TRequest & { _requestId?: string }>(normalizedEvent, async (detail) => {
      if (!detail?._requestId) {
        this.log('warn', `响应处理器收到无 requestId 的消息: ${normalizedEvent}`);
        return;
      }

      const requestId = detail._requestId;
      const responseEvent = `${normalizedEvent}:response:${requestId}`;
      
      try {
        const { _requestId, ...requestData } = detail;
        const response = await handler(requestData as TRequest);
        this.emit(responseEvent, response);
      } catch (error) {
        this.log('error', `响应处理器执行错误: ${normalizedEvent}`, error);
        const errorResponseEvent = `${normalizedEvent}:error:${requestId}`;
        this.emit(errorResponseEvent, error);
      }
    });
  }

  /**
   * 将消息加入队列（离线消息）
   */
  private enqueueMessage(event: string, detail: any): void {
    if (!this.messageQueue.has(event)) {
      this.messageQueue.set(event, []);
    }

    const queue = this.messageQueue.get(event)!;
    queue.push(detail);

    // 限制队列大小
    if (queue.length > this.options.maxQueueSize) {
      queue.shift();
      this.log('warn', `消息队列已满，移除最旧消息: ${event}`);
    }
  }

  /**
   * 处理消息队列
   */
  private processQueue(event: string): void {
    const queue = this.messageQueue.get(event);
    if (!queue || queue.length === 0) return;

    this.log('info', `处理离线消息队列: ${event}`, { queueSize: queue.length });

    const messages = [...queue];
    this.messageQueue.delete(event);

    messages.forEach((detail) => {
      this.emit(event, detail);
    });
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.events.clear();
    this.onceHandlers.clear();
    this.messageQueue.clear();
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeout);
    });
    this.pendingRequests.clear();
    this.log('info', '已清除所有事件监听器');
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount(event?: string): number {
    if (event) {
      const normalizedEvent = this.normalizeEventName(event);
      const handlers = this.events.get(normalizedEvent)?.size ?? 0;
      const onceHandlers = this.onceHandlers.get(normalizedEvent)?.size ?? 0;
      return handlers + onceHandlers;
    }
    
    let total = 0;
    this.events.forEach((handlers) => {
      total += handlers.size;
    });
    this.onceHandlers.forEach((handlers) => {
      total += handlers.size;
    });
    return total;
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    const names = new Set<string>();
    this.events.forEach((_, event) => names.add(event));
    this.onceHandlers.forEach((_, event) => names.add(event));
    return Array.from(names);
  }
}

// 导出单例实例（默认配置）
export const eventBus = new EventBus({
  debug: import.meta.env.DEV, // 开发环境自动启用调试
  namespace: true,
  maxQueueSize: 100,
});

// 导出类，允许创建多个实例
export { EventBus };
export type { EventHandler, EventBusOptions };

