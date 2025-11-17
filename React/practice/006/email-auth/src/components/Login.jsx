import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // 清除之前的错误
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      login(formData.email, formData.password)
      // 登录成功后的处理在 App.jsx 中通过 useAuth 的状态变化来处理
    } catch (err) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>登录账号</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">邮箱</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>

      <div className="switch-auth">
        还没有账号？{' '}
        <button type="button" className="link-btn" onClick={onSwitchToRegister}>
          立即注册
        </button>
      </div>
    </div>
  )
}

