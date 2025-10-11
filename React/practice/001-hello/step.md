[1 tool called]

## 阶段 1 指南

- **目标** 熟悉 Node.js 环境、创建 React 项目，并实现第一个计数器组件。
- **准备** 安装 Node.js（建议 LTS 版本）。macOS 可用 Homebrew：`brew install node`；安装后用 `node -v` 和 `npm -v` 确认版本。
- **创建项目** 在目标目录执行 `npm create vite@latest`，命名为 `myapp`，选择 `React` + `JavaScript`；按提示进入 `myapp` 并运行 `npm install`。
- **运行开发服务器** 执行 `npm run dev`，记下显示的本地地址（通常是 `http://localhost:5173`），在浏览器打开确认默认页面加载正常。
- **了解结构** 浏览 `myapp` 下的核心文件：`index.html`（挂载点）、`src/main.jsx`（入口）、`src/App.jsx`（主组件）。
- **实现计数器** 在 `App.jsx` 中引入 `useState` 并添加简易计数器组件，实现点击按钮数值 +1，确认热更新工作。
- **验证** 保存后浏览器应实时更新；若出现错误，查看终端日志或浏览器控制台。

function App() {

  const [count,setCount] = useState(0)

  return (
    <>
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
    </>
  )
}