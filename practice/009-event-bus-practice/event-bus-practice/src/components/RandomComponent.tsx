import { FC, useState } from "react";
import { useEventChat } from "../hooks/useEventChat";

/**
 * 示例组件：展示跨组件通信
 * 这个组件与 SubMox 没有任何关系，但也能收到相同的消息
 */
const RandomComponent: FC = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEventChat("sub-mox", {
    callback: (msg) => {
      console.log("RandomComponent 也收到:", msg);
      setMessages((prev) => [...prev, { ...msg, receivedAt: Date.now() }]);
    },
  });

  return (
    <div style={{ padding: "20px", border: "2px solid #2196F3", borderRadius: "8px", margin: "10px" }}>
      <h3 style={{ color: "#000" }}>RandomComponent 组件</h3>
      <p style={{ color: "#000" }}>我不在同层级，也能收到 "sub-mox" 的消息</p>
      <div style={{ marginTop: "10px" }}>
        <strong style={{ color: "#000" }}>收到的消息列表：</strong>
        {messages.length === 0 ? (
          <p style={{ color: "#000" }}>暂无消息</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {messages.map((msg, index) => (
              <li
                key={index}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                  color: "#000",
                }}
              >
                {JSON.stringify(msg, null, 2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RandomComponent;

