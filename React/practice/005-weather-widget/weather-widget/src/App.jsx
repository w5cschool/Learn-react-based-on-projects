import './App.css'
import Weather from './components/Weather.jsx'

export default function App() {
  return (
    <div className="app-container">
      <h1>天气查询</h1>
      <p className="sub">输入城市名，例如：北京、上海、广州、深圳</p>
      <Weather />
      <footer className="footer">
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">数据来源：Open‑Meteo</a>
      </footer>
    </div>
  )
}


