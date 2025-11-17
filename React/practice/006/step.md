# 邮箱注册登录练习

这是一个使用 React 实现的邮箱注册登录系统练习项目。

## 功能特性

1. **用户注册**
   - 邮箱格式验证
   - 密码长度验证（至少 6 位）
   - 确认密码验证
   - 可选昵称输入
   - 防止重复注册

2. **用户登录**
   - 邮箱和密码验证
   - 错误提示

3. **状态管理**
   - 使用 React Context 管理用户状态
   - 使用 localStorage 持久化存储用户数据
   - 登录状态保持（刷新页面后仍然保持登录）

4. **用户体验**
   - 表单验证和错误提示
   - 加载状态提示
   - 登录/注册页面切换
   - 登录后显示欢迎页面

## 技术要点

### 1. React Context API
- `AuthContext.jsx` 提供了用户认证的全局状态管理
- `AuthProvider` 组件包装应用，提供认证功能
- `useAuth` Hook 用于在组件中访问认证状态和方法

### 2. localStorage 持久化
- 用户数据存储在浏览器的 localStorage 中
- 登录状态通过 localStorage 保持
- 刷新页面后自动恢复登录状态

### 3. 表单处理
- 受控组件：使用 `useState` 管理表单状态
- 表单验证：邮箱格式、密码长度、密码确认
- 错误处理：友好的错误提示信息

### 4. 组件设计
- `Login.jsx`：登录组件
- `Register.jsx`：注册组件
- `AuthContext.jsx`：认证上下文
- `App.jsx`：主应用组件，根据登录状态切换显示

## 学习要点

1. **Context API 的使用**
   - 创建 Context：`createContext()`
   - 提供 Context：`AuthProvider` 组件
   - 使用 Context：`useContext()` 或自定义 Hook

2. **localStorage 的使用**
   - `localStorage.setItem()` 保存数据
   - `localStorage.getItem()` 读取数据
   - `localStorage.removeItem()` 删除数据
   - 注意：localStorage 只能存储字符串，需要使用 `JSON.stringify()` 和 `JSON.parse()`

3. **表单验证**
   - 邮箱格式验证：正则表达式 `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - 密码长度验证
   - 密码确认验证

4. **状态管理**
   - 使用 `useState` 管理组件内部状态
   - 使用 Context 管理全局状态
   - 状态同步和持久化

## 运行项目

```bash
cd React/practice/006/email-auth
npm install
npm run dev
```

## 练习扩展

可以尝试添加以下功能：

1. **密码强度提示**
   - 显示密码强度（弱/中/强）
   - 要求包含字母、数字、特殊字符

2. **记住我功能**
   - 登录时可以选择"记住我"
   - 使用更长的过期时间

3. **忘记密码功能**
   - 发送重置密码链接（可以模拟）

4. **用户信息编辑**
   - 登录后可以修改昵称
   - 修改密码功能

5. **更好的错误提示**
   - 更详细的验证错误信息
   - 字段级别的错误提示

6. **路由保护**
   - 使用 React Router 实现路由
   - 未登录时重定向到登录页

