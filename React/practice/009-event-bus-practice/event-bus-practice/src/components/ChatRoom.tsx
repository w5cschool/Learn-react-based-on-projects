import { FC, useState } from "react";
import { useEventChat } from "../hooks/useEventChat";

/**
 * 示例组件：展示命名空间聊天室
 */
const ChatRoom: FC<{ roomId: string }> = ({ roomId }) => {
  const [messages, setMessages] = useState<Array<{ user: string; message: string; time: number }>>([]);
  const [input, setInput] = useState("");

  const [emit] = useEventChat(`room:${roomId}`, {
    callback: (detail?: { user: string; message: string; time: number }) => {
      if (detail) {
        setMessages((prev) => [...prev, detail]);
      }
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    
    emit({
      user: `User-${Math.floor(Math.random() * 1000)}`,
      message: input,
      time: Date.now(),
    });
    setInput("");
  };

  return (
    <div style={{ padding: "20px", border: "2px solid #FF9800", borderRadius: "8px", margin: "10px" }}>
      <h3 style={{ color: "#000" }}>聊天室 #{roomId}</h3>
      <div
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "#000" }}>暂无消息</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "8px", color: "#000" }}>
              <strong style={{ color: "#000" }}>{msg.user}:</strong>{" "}
              <span style={{ color: "#000" }}>{msg.message}</span>
              <span style={{ fontSize: "12px", color: "#000", marginLeft: "8px" }}>
                {new Date(msg.time).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="输入消息..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            color: "#000",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "8px 16px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

