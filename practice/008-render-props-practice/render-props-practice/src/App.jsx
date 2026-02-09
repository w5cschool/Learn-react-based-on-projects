import { useState } from 'react'
import Logger from './components/Logger.jsx'
import MouseTracker from './components/MouseTracker.jsx'
import DataProvider from './components/DataProvider.jsx'
import { useMousePosition } from './hooks/useMousePosition.js'
import './App.css'

// 练习 4 的组件（使用 Hooks）
function MouseDisplayWithHook() {
  const { x, y } = useMousePosition();
  return (
    <div className="mouse-display">
      <p>鼠标坐标（使用 Hook）：({x}, {y})</p>
    </div>
  );
}

export default function App() {
  const [activeExercise, setActiveExercise] = useState(1)

  return (
    <div className="app-container">
      <header className="header">
        <h1>🧩 React Render Props 巩固练习</h1>
        <p className="subtitle">通过 4 个练习深入理解 Render Props 模式</p>
      </header>

      <nav className="exercise-nav">
        {[1, 2, 3, 4].map((num) => (
          <button
            key={num}
            className={`nav-btn ${activeExercise === num ? 'active' : ''}`}
            onClick={() => setActiveExercise(num)}
          >
            练习 {num}
          </button>
        ))}
      </nav>

      <main className="exercise-container">
        {/* 练习 1：基础理解 */}
        {activeExercise === 1 && (
          <div className="exercise">
            <h2>练习 1：基础理解</h2>
            <p className="exercise-desc">
              写一个 <code>Logger</code> 组件，它接受一个 <code>render</code> 函数作为 props。
              每 1 秒钟随机生成一个 1~100 的数字，并通过 <code>props.render(number)</code> 把这个数字交给外部渲染。
            </p>
            <div className="exercise-content">
              <Logger
                render={(num) => (
                  <div className="logger-display">
                    <p className="result-text">当前随机数是：<span className="highlight">{num}</span></p>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* 练习 2：复用逻辑 */}
        {activeExercise === 2 && (
          <div className="exercise">
            <h2>练习 2：复用逻辑</h2>
            <p className="exercise-desc">
              同时使用两个 render props 组件：显示鼠标坐标和显示随机数字。
              体会 render props 带来的"逻辑复用 + UI 灵活组合"。
            </p>
            <div className="exercise-content">
              <div className="dual-display">
                <MouseTracker
                  render={({ x, y }) => (
                    <div className="display-card">
                      <h3>🖱️ 鼠标坐标</h3>
                      <p className="result-text">
                        X: <span className="highlight">{x}</span>px, 
                        Y: <span className="highlight">{y}</span>px
                      </p>
                    </div>
                  )}
                />
                <Logger
                  render={(num) => (
                    <div className="display-card">
                      <h3>🎲 随机数字</h3>
                      <p className="result-text">
                        当前随机数是：<span className="highlight">{num}</span>
                      </p>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* 练习 3：render props 组合 */}
        {activeExercise === 3 && (
          <div className="exercise">
            <h2>练习 3：render props 组合</h2>
            <p className="exercise-desc">
              组合使用 <code>DataProvider</code> 和 <code>MouseTracker</code>，
              展示 render props 可以"嵌套使用"，每个组件都控制自己的逻辑与状态。
            </p>
            <div className="exercise-content">
              <DataProvider
                render={({ data, loading }) => (
                  <MouseTracker
                    render={({ x, y }) => (
                      <div className="combined-display">
                        <div className="display-card">
                          <h3>📦 数据</h3>
                          {loading ? (
                            <p className="result-text">加载中...</p>
                          ) : (
                            <p className="result-text">{data}</p>
                          )}
                        </div>
                        <div className="display-card">
                          <h3>🖱️ 鼠标坐标</h3>
                          <p className="result-text">
                            X: <span className="highlight">{x}</span>px, 
                            Y: <span className="highlight">{y}</span>px
                          </p>
                        </div>
                      </div>
                    )}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* 练习 4：理解 Hooks 替代方案 */}
        {activeExercise === 4 && (
          <div className="exercise">
            <h2>练习 4：理解 Hooks 替代方案</h2>
            <p className="exercise-desc">
              用自定义 Hook <code>useMousePosition</code> 替代 <code>MouseTracker</code> 的 render props 模式。
              对比两种方式的优缺点。
            </p>
            <div className="exercise-content">
              <div className="comparison">
                <div className="comparison-item">
                  <h3>使用 Render Props</h3>
                  <MouseTracker
                    render={({ x, y }) => (
                      <div className="display-card">
                        <p className="result-text">
                          鼠标坐标：({x}, {y})
                        </p>
                      </div>
                    )}
                  />
                </div>
                <div className="comparison-item">
                  <h3>使用 Custom Hook</h3>
                  <MouseDisplayWithHook />
                </div>
              </div>
              <div className="thinking-box">
                <h4>💭 思考题：</h4>
                <ul>
                  <li>这样写和 render props 相比，有什么优点？</li>
                  <li>哪种更清晰、更可复用？</li>
                  <li>为什么 render props 模式在 Hooks 出现后逐渐被取代？</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>通过这 4 个练习，深入理解 Render Props 的使用场景与思想 ✨</p>
      </footer>
    </div>
  )
}

