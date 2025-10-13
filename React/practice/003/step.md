[2 tools called]

## Step 1 · 准备开发环境  
- **目标** 熟悉要构建的页面：API 来源、要展示的字段、交互（过滤/排序、加载状态、错误状态）。  
- **行动** 先浏览 https://fakestoreapi.com/ 的 `/products` 数据结构，确认每件商品返回的字段（`title`、`price`、`category`、`image`、`rating` 等）。  
- **结果** 在脑海或笔记里写下想要的界面草图，以及每个组件/状态的职责。完成后告诉我“完成 Step 1”，我们进入下一步。

## Step 2 · 初始化 Vite + React 项目  
- **命令**（在终端执行）  
  - `cd /Users/steve/Desktop/2026-study/React-Study/React/practice/003`  
  - `npm create vite@latest product-catalog -- --template react`  
  - `cd /Users/steve/Desktop/2026-study/React-Study/React/practice/003/product-catalog`  
  - `npm install`  
- **验证** 运行 `npm run dev`，确认开发服务器能启动（默认 http://localhost:5173/）。  
- **结果** 浏览器应显示 Vite 欢迎页。准备好后告诉我“完成 Step 2”。

## Step 3 · 梳理项目结构与组件设计  
- **目标** 明确页面到代码的映射，决定状态怎么流动。  
- **行动**  
  - 在 `src` 下准备好这些文件：`components/ProductCard.jsx`、`components/Filters.jsx`（可先空文件），`App.jsx` 负责整体布局和逻辑。  
  - 在白纸或脑中写下：  
    - `App` 管理哪些状态？建议包含：`products`（API 返回）、`filteredProducts` 或筛选条件（如 `selectedCategory`、`sortOrder`）、`isLoading`、`errorMessage`。  
    - `useEffect` 何时触发？如何在加载前设置 `isLoading`，请求失败时设定 `errorMessage`？  
    - `Filters` 需要哪些 props（例如 `categories`, `selectedCategory`, `onCategoryChange`, `sortOrder`, `onSortChange`）  
    - `ProductCard` 接收哪个商品对象？要展示 `image`, `title`, `price`, `rating?.rate`。  
  - 想一想 UI 布局：顶部放筛选器，中部产品网格，底部留空或显示状态。  
- **结果** 形成清晰的组件/状态设计。完成后告诉我“完成 Step 3”，我们进入下一步。

## Step 4 · 实现数据获取与基础状态管理  
- **目标** 让 `App` 从 API 拉取数据，并能显示加载/错误状态。  
- **准备** 在 `src` 下建好 `components` 目录，空文件：`components/ProductCard.jsx`、`components/Filters.jsx`（可以先放一行注释避免空文件报错）。  
- **操作步骤**  
  1. 打开 `src/App.jsx`，清空模板内容。  
  2. 引入 `useEffect`、`useState`。  
  3. 定义这些 state：  
     - `products`（原始数据数组）  
     - `filteredProducts`（后面筛选/排序要用，暂时先直接等于 `products`）  
     - `categories`（字符串数组，第一个可以是 `'All'`）  
     - `selectedCategory`（默认 `'All'`）  
     - `sortOrder`（默认 `'none'` 或 `'asc'`）  
     - `isLoading`（布尔）  
     - `errorMessage`（字符串）  
  4. 在 `useEffect` 中声明一个 `async function fetchProducts()`：  
     - 调用 `setIsLoading(true)`，`setErrorMessage('')`。  
     - 使用 `fetch('https://fakestoreapi.com/products')`；处理 `response.ok`，不 OK 时抛出错误。  
     - `const data = await response.json();`  
     - `setProducts(data); setFilteredProducts(data);`  
     - 从 `data` 中提取去重的分类列表：`const uniqueCategories = [...new Set(data.map(item => item.category))];`；前面加 `'All'` 并 `setCategories(uniqueCategoriesWithAll)`。  
     - `catch` 中 `setErrorMessage(error.message || 'Failed to load products');`  
     - 最后 `finally` 里 `setIsLoading(false)`。  
  5. `useEffect` 只在组件挂载时执行一次。  
  6. 在 JSX 中暂时放置：  
     - 标题 `h1`；  
     - 当 `isLoading` 为 true 时显示“Loading products...”  
     - 若 `errorMessage` 有内容，显示出来；  
     - 当 `filteredProducts.length === 0` 且没有错误时显示“没有找到商品”；  
     - 否则用简单的 `div` 列出 `filteredProducts`，暂时只展示商品名称。  
- **小贴士** 数据请求可以单独抽成函数，但目前直接写在 `useEffect` 里即可。  
- **验证** 保存后刷新页面，应该先看到“Loading...”，随后出现商品标题列表；若断网或 API 挂掉，应出现错误信息。

完成后告诉我“完成 Step 4”，我们再实现筛选和卡片样式。


<!-- 我的错误 -->
[1 tool called]

出错的关键是 `fetchProducts` 里又调用了自己，导致返回值是 `undefined`，后面访问 `.ok` 就崩了。照下面的顺序改一下 `App.jsx`：

1. **正确发请求**  
   把 `const response = await fetchProducts('https://fakestoreapi.com/products')` 改成  
   `const response = await fetch('https://fakestoreapi.com/products');`

2. **一次性处理 loading**  
   保留 `finally { setIsLoading(false); }`，把 `setIsLoading(false)` 在 `try` 里的那次删掉。

3. **初始化状态**  
   - `filteredProducts` 用空数组开始：`const [filteredProducts, setFilteredProducts] = useState([]);`  
   - 如果暂时不用搜索/排序，可以把 `search`、`sort` 这两个 state 先移除。  
   - `categories` 要有一个默认值 `['All']`，这样即使 API 失败也不会报错：  
     `const [categories, setCategories] = useState(['All']);`

4. **更新分类列表**  
   获取到数据后使用数组形式：  
   `setCategories(['All', ...uniqueCategories]);`

改完保存，再 `npm run dev`，浏览器应该能看到产品列表。如果成功了，就算 “完成 Step 4”，我们继续做筛选和卡片组件。



<!-- 问题 -->
这里的 `&&` 是 JavaScript 里的逻辑与运算符，在 React JSX 中常用来做条件渲染。

- 逻辑规则：`a && b` 先判断左边 `a` 的真假。  
  - 如果 `a` 是 `false`（或其它“假值”如 `0`、`''`、`null`、`undefined`），整个表达式直接返回 `a`，不会去执行右边。  
  - 如果 `a` 是 `true`（或“真值”），就返回右边的结果 `b`。

- 在 JSX 里：`{isLoading && <p>Loading products...</p>}`  
  - 当 `isLoading` 为 `true`，`<p>...</p>` 会被返回并渲染。  
  - 当 `isLoading` 为 `false`，表达式返回 `false`，React 会忽略，不渲染任何东西。

这种写法是条件渲染的一种快捷方式，等价于写：

```jsx
{isLoading ? <p>Loading products...</p> : null}
```

选择用 `&&` 是因为我们只想在条件为真时渲染组件，条件为假时什么都不展示。


[1 tool called]

我们把 `Step 5` 的代码整理好了，你只要把下面两段替换进文件即可。

### 更新 `src/App.jsx`

```1:97:React/practice/003/product-catalog/src/App.jsx
import { useEffect, useState } from 'react';
import Filters from './components/Filters';
import './App.css';

// ... existing code ...
function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function fetchProducts() {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      const uniqueCategories = [...new Set(data.map((product) => product.category))];
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }

    let updated = [...products];

    if (selectedCategory !== 'All') {
      updated = updated.filter((product) => product.category === selectedCategory);
    }

    if (sortOrder === 'asc') {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      updated.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updated);
  }, [products, selectedCategory, sortOrder]);

  return (
    <>
      <h1>Product Catalog</h1>
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />
      {isLoading && <p>Loading products...</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!isLoading && !errorMessage && filteredProducts.length === 0 && <p>No products found</p>}
      {filteredProducts.length > 0 && (
        <div>
          {filteredProducts.map((item) => (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
```

### 新建 `src/components/Filters.jsx`

```javascript
import PropTypes from 'prop-types';

function Filters({ categories, selectedCategory, onCategoryChange, sortOrder, onSortOrderChange }) {
  return (
    <div className="filters">
      <label>
        Category:
        <select value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Sort by price:
        <select value={sortOrder} onChange={(event) => onSortOrderChange(event.target.value)}>
          <option value="none">Default</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </label>
    </div>
  );
}

Filters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.oneOf(['none', 'asc', 'desc']).isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
};

export default Filters;
```

保存后重新启动 `npm run dev`，刷新页面就能看到筛选和排序的效果。完成后告诉我，我们继续做产品卡片样式。