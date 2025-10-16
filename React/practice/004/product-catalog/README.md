# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




### Shopping Cart Roadmap

- **目标概览**：在 `React/practice/003/product-catalog` 基础上扩展出 `首页 → 产品详情 → 购物车` 的完整体验，新增全局购物车状态、数量提示、加减商品、总价结算，并引入 React Router 做导航。

### 阶段 4 具体步骤（逐步推进）

1. **环境与依赖**
   - 安装路由：`npm install react-router-dom`
   - 目录建议：在 `src` 下新建 `pages/`, `context/`, `components/`（已有可复用）。
   - 确保启动无误：`npm run dev`

2. **路由框架搭建**
   - 在 `main.jsx` 或入口中用 `<BrowserRouter>` 包裹 `<App />`
   - 在 `App.jsx` 内用 `Routes` 定义页面：`/`(首页)、`/products`(产品列表)、`/products/:id`(详情)、`/cart`(购物车)
   - 临时返回简单布局确认路由可点击切换

3. **准备数据层**
   - 把当前抓取商品的逻辑移动到 `pages/Products.jsx`
   - 保留已有的筛选排序逻辑
   - 新闻数据源沿用 `https://fakestoreapi.com/products`

4. **创建购物车上下文**
   - 在 `src/context/CartContext.jsx` 中
   - `CartProvider` 管理状态：`items`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `cartCount`, `cartTotal`
   - 用 `useReducer` or `useState`（推荐 `useReducer`）
   - 在 `App.jsx` 顶层使用 `<CartProvider>`

5. **组件改造**
   - 在 `components` 中新增/调整：
     - `Header`：展示导航链接、购物车数量徽标
     - `ProductList`/`ProductCard`：卡片中添加 “Add to Cart”
     - `CartItem`：控制数量增减、删除
   - 注意 Props 设计与上下文解耦

6. **实现页面**
   - `pages/Home.jsx`：高阶介绍、按钮跳转到产品列表
   - `pages/Products.jsx`：使用之前的筛选排序 + “Add to Cart”
   - `pages/ProductDetail.jsx`：单品详情（从 `useParams` 获得 ID 再 fetch）
   - `pages/Cart.jsx`：显示购物车内容、显示总价、操作控件

7. **交互细节**
   - 切换分类保留已有逻辑
   - `Add to Cart` 点击后通知成功（可用简单 `<p>` 或 toast）
   - 数量控制：限制不小于 1，超过库存（可先忽略或假设充足）
   - 计算总价时注意浮点处理（保留两位）

8. **增强体验**
   - 加载状态/错误处理重用现有模式
  - 可加空购物车提示
   - 详情页按钮：`Add to Cart` + `Go to Cart`

9. **测试与验证**
   - 手动流程：进入首页 → 产品 → 加入购物车 → 修改数量 → 查看总价
   - 验证刷新时购物车是否清空（若要持久化，可后续用 `localStorage`）
   - 如时间允许，写基础组件测试（可选）

10. **后续拓展想法（可选）**
   - 搜索功能迁移至 `Products` 页
   - 优惠码、配送信息
   - Redux Toolkit 替代 Context

随时告诉我你完成到哪一步，我会继续提供对应的代码示例/指导。