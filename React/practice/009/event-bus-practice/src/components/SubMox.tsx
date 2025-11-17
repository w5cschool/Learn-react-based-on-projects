import { FC } from "react";
import { useEventChat } from "../hooks/useEventChat";

/**
 * 示例组件：订阅和发布事件
 */
const SubMox: FC = () => {
  const [emit] = useEventChat("sub-mox", {
    callback: (detail) => {
      console.log("收到消息 a----sub-mox:", detail);
    },
  });

  return (
    <div style={{ padding: "20px", border: "2px solid #4CAF50", borderRadius: "8px", margin: "10px" }}>
      <h3>SubMox 组件</h3>
      <p>点击按钮发送消息到 "sub-mox" 频道</p>
      <button
        type="button"
        onClick={() => emit({ name: "pub-mox", timestamp: Date.now() })}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Click it - 发送消息
      </button>
    </div>
  );
};

export default SubMox;

