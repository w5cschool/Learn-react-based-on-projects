/**
 * React Hook for Event Bus
 * 提供简洁的 API 来订阅和发布事件
 */

import { useEffect, useCallback, useRef } from "react";
import { eventBus, EventHandler } from "../eventBus";

export interface UseEventChatOptions<T = any> {
  /** 事件回调函数 */
  callback?: EventHandler<T>;
  /** 是否只触发一次 */
  once?: boolean;
  /** 是否立即启用（默认 true） */
  enabled?: boolean;
}

/**
 * 事件聊天 Hook
 * 
 * @example
 * ```tsx
 * const [emit] = useEventChat("sub-mox", {
 *   callback: (detail) => console.log("收到消息:", detail),
 * });
 * 
 * // 发送消息
 * emit({ name: "pub-mox" });
 * ```
 */
export function useEventChat<T = any>(
  eventName: string,
  options?: UseEventChatOptions<T>
): [emit: (detail?: T) => void] {
  const { callback, once = false, enabled = true } = options || {};
  const callbackRef = useRef(callback);
  const handlerRef = useRef<EventHandler<T> | null>(null);

  // 保持 callback 引用最新
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 创建稳定的 handler
  useEffect(() => {
    if (!enabled || !callback) {
      handlerRef.current = null;
      return;
    }

    const handler: EventHandler<T> = (detail) => {
      callbackRef.current?.(detail);
    };

    handlerRef.current = handler;

    if (once) {
      eventBus.once(eventName, handler);
    } else {
      eventBus.on(eventName, handler);
    }

    return () => {
      if (handlerRef.current) {
        eventBus.off(eventName, handlerRef.current);
      }
    };
  }, [eventName, once, enabled]);

  // 创建 emit 函数
  const emit = useCallback(
    (detail?: T) => {
      eventBus.emit(eventName, detail);
    },
    [eventName]
  );

  return [emit] as const;
}

/**
 * 异步事件聊天 Hook
 * 
 * @example
 * ```tsx
 * const [emitAsync] = useEventChatAsync("async-event", {
 *   callback: async (detail) => {
 *     await doSomething(detail);
 *   },
 * });
 * 
 * await emitAsync({ data: "test" });
 * ```
 */
export function useEventChatAsync<T = any>(
  eventName: string,
  options?: UseEventChatOptions<T>
): [emitAsync: (detail?: T) => Promise<void>] {
  const { callback, once = false, enabled = true } = options || {};
  const callbackRef = useRef(callback);
  const handlerRef = useRef<EventHandler<T> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !callback) {
      handlerRef.current = null;
      return;
    }

    const handler: EventHandler<T> = async (detail) => {
      await callbackRef.current?.(detail);
    };

    handlerRef.current = handler;

    if (once) {
      eventBus.once(eventName, handler);
    } else {
      eventBus.on(eventName, handler);
    }

    return () => {
      if (handlerRef.current) {
        eventBus.off(eventName, handlerRef.current);
      }
    };
  }, [eventName, once, enabled]);

  const emitAsync = useCallback(
    async (detail?: T) => {
      await eventBus.emitAsync(eventName, detail);
    },
    [eventName]
  );

  return [emitAsync] as const;
}

/**
 * 请求/响应模式 Hook
 * 
 * @example
 * ```tsx
 * // 服务端组件
 * useEventRespond("getUser", async ({ id }) => {
 *   return await fetchUser(id);
 * });
 * 
 * // 客户端组件
 * const request = useEventRequest("getUser");
 * const user = await request({ id: 123 });
 * ```
 */
export function useEventRequest<TRequest = any, TResponse = any>(
  eventName: string,
  timeout: number = 5000
): (detail?: TRequest) => Promise<TResponse> {
  return useCallback(
    (detail?: TRequest) => {
      return eventBus.request<TRequest, TResponse>(eventName, detail, timeout);
    },
    [eventName, timeout]
  );
}

/**
 * 响应请求 Hook
 */
export function useEventRespond<TRequest = any, TResponse = any>(
  eventName: string,
  handler: (detail?: TRequest) => TResponse | Promise<TResponse>,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    eventBus.respond<TRequest, TResponse>(eventName, handler);

    // 注意：respond 内部已经注册了监听器，这里不需要手动清理
    // 因为 respond 使用的是 on，会在组件卸载时自动清理
  }, [eventName, handler, enabled]);
}

