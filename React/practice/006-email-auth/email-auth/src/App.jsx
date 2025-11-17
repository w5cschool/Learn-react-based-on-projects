import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import './App.css'

function AuthApp() {
  const { user, logout } = useAuth()
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  // 如果已登录，显示欢迎页面
  if (user) {
    return (
      <div className="app-container">
        <div className="welcome-card">
          <h1>欢迎回来！</h1>
          <div className="user-info">
            <p><strong>昵称：</strong>{user.name}</p>
            <p><strong>邮箱：</strong>{user.email}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            退出登录
          </button>
        </div>
      </div>
    )
  }

  // 未登录，显示登录或注册表单
  return (
    <div className="app-container">
      <div className="auth-wrapper">
        <h1>邮箱注册登录</h1>
        <p className="sub">使用邮箱和密码注册或登录账号</p>
        {isRegisterMode ? (
          <Register onSwitchToLogin={() => setIsRegisterMode(false)} />
        ) : (
          <Login onSwitchToRegister={() => setIsRegisterMode(true)} />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  )
}

