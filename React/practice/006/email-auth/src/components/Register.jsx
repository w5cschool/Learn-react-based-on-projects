import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Register.css'

export default function Register({ onSwitchToLogin }) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 邮箱格式验证
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

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
      // 验证邮箱格式
      if (!isValidEmail(formData.email)) {
        throw new Error('请输入有效的邮箱地址')
      }

      // 验证密码长度
      if (formData.password.length < 6) {
        throw new Error('密码长度至少为 6 位')
      }

      // 验证两次密码是否一致
      if (formData.password !== formData.confirmPassword) {
        throw new Error('两次输入的密码不一致')
      }

      // 注册用户
      register(formData.email, formData.password, formData.name)

      // 注册成功，切换到登录页面
      alert('注册成功！请登录')
      onSwitchToLogin()
    } catch (err) {
      setError(err.message || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>注册账号</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">昵称（可选）</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入昵称"
          />
        </div>

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
            placeholder="至少 6 位字符"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="再次输入密码"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      <div className="switch-auth">
        已有账号？{' '}
        <button type="button" className="link-btn" onClick={onSwitchToLogin}>
          立即登录
        </button>
      </div>
    </div>
  )
}

