import { FC } from "react";
import SubMox from "./components/SubMox";
import RandomComponent from "./components/RandomComponent";
import ChatRoom from "./components/ChatRoom";
import RequestResponseDemo from "./components/RequestResponseDemo";
import OnceDemo from "./components/OnceDemo";
import "./App.css";

const App: FC = () => {
  return (
    <div className="app">
      <header>
        <h1>🚀 Event Bus 事件总线实践</h1>
        <p>跨组件、跨层级、无关系组件之间的通信解决方案</p>
      </header>

      <main>
        <section>
          <h2>1. 基础用法：跨组件通信</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <SubMox />
            <RandomComponent />
          </div>
        </section>

        <section>
          <h2>2. 命名空间聊天室</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <ChatRoom roomId="1" />
            <ChatRoom roomId="2" />
          </div>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
            💡 每个聊天室使用不同的命名空间（room:1, room:2），互不干扰
          </p>
        </section>

        <section>
          <h2>3. 请求/响应模式（RPC）</h2>
          <RequestResponseDemo />
        </section>

        <section>
          <h2>4. Once 事件（只触发一次）</h2>
          <OnceDemo />
        </section>
      </main>

      <footer>
        <p>
          📖 打开浏览器控制台查看详细的事件日志（开发环境自动启用调试模式）
        </p>
      </footer>
    </div>
  );
};

export default App;

