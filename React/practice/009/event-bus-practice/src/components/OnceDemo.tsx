import { FC, useState } from "react";
import { useEventChat } from "../hooks/useEventChat";
import { eventBus } from "../eventBus";

/**
 * 示例组件：展示 once 功能（只触发一次）
 */
const OnceDemo: FC = () => {
  const [count, setCount] = useState(0);

  useEventChat("once-event", {
    callback: () => {
      setCount((prev) => prev + 1);
      console.log("Once 事件被触发，这是唯一一次");
    },
    once: true, // 只触发一次
  });

  const handleEmit = () => {
    eventBus.emit("once-event", { message: "这条消息只会被处理一次" });
  };

  return (
    <div style={{ padding: "20px", border: "2px solid #E91E63", borderRadius: "8px", margin: "10px" }}>
      <h3>Once 事件演示</h3>
      <p>这个事件只会被处理一次，即使多次发送</p>
      <p>
        <strong>触发次数：</strong> {count}
      </p>
      <button
        onClick={handleEmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#E91E63",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        发送事件（多次点击试试）
      </button>
    </div>
  );
};

export default OnceDemo;

