import { FC, useState } from "react";
import { useEventRequest, useEventRespond } from "../hooks/useEventChat";

/**
 * 示例组件：展示请求/响应模式（类似 RPC）
 */
const RequestResponseDemo: FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 服务端：响应请求
  useEventRespond("getUser", async ({ id }: { id: number }) => {
    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      name: `用户 ${id}`,
      email: `user${id}@example.com`,
    };
  });

  // 客户端：发送请求
  const requestUser = useEventRequest<{ id: number }, { id: number; name: string; email: string }>("getUser");

  const handleRequest = async () => {
    setLoading(true);
    try {
      const user = await requestUser({ id: Math.floor(Math.random() * 100) });
      setResult(JSON.stringify(user, null, 2));
    } catch (error) {
      setResult(`错误: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "2px solid #9C27B0", borderRadius: "8px", margin: "10px" }}>
      <h3>请求/响应模式演示（RPC）</h3>
      <p>点击按钮发送请求，获取用户信息</p>
      <button
        onClick={handleRequest}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "请求中..." : "获取用户信息"}
      </button>
      {result && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default RequestResponseDemo;

