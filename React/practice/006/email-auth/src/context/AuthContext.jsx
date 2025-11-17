import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// 从 localStorage 获取用户数据
function getUsersFromStorage() {
  try {
    const data = localStorage.getItem('users')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 保存用户数据到 localStorage
function saveUsersToStorage(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users))
  } catch (err) {
    console.error('保存用户数据失败:', err)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])

  // 组件挂载时从 localStorage 加载用户数据
  useEffect(() => {
    const storedUsers = getUsersFromStorage()
    setUsers(storedUsers)
    
    // 检查是否有已登录的用户
    const currentUserEmail = localStorage.getItem('currentUser')
    if (currentUserEmail) {
      const foundUser = storedUsers.find(u => u.email === currentUserEmail)
      if (foundUser) {
        setUser(foundUser)
      }
    }
  }, [])

  // 注册新用户
  const register = (email, password, name) => {
    const existingUsers = getUsersFromStorage()
    
    // 检查邮箱是否已注册
    if (existingUsers.some(u => u.email === email)) {
      throw new Error('该邮箱已被注册')
    }

    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // 实际应用中应该加密
      name: name || email.split('@')[0]
    }

    const updatedUsers = [...existingUsers, newUser]
    setUsers(updatedUsers)
    saveUsersToStorage(updatedUsers)
    return newUser
  }

  // 登录
  const login = (email, password) => {
    const existingUsers = getUsersFromStorage()
    const foundUser = existingUsers.find(
      u => u.email === email && u.password === password
    )

    if (!foundUser) {
      throw new Error('邮箱或密码错误')
    }

    setUser(foundUser)
    localStorage.setItem('currentUser', email)
    return foundUser
  }

  // 登出
  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return context
}

