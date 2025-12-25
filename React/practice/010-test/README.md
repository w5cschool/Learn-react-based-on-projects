# Testimonials Next.js Page

这是一个基于 Next.js 14 的用户评价展示页面，展示了无限滚动的用户评价卡片。

## 功能特性

- ✨ 无限滚动的用户评价展示
- 🎨 美观的紫色渐变背景
- 📱 响应式设计，支持移动端和桌面端
- 🎯 鼠标悬停暂停滚动效果
- 🌐 支持多种平台图标（YouTube, Discord, Twitter, Google）
- 🎭 深色模式支持

## 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看页面。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
010-test/
├── app/
│   ├── layout.tsx      # 根布局组件
│   ├── page.tsx        # 首页
│   └── globals.css     # 全局样式
├── components/
│   └── Testimonials.tsx # 用户评价组件
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

## 组件说明

### Testimonials 组件

`Testimonials` 组件接受以下 props：

- `testimonials?: Testimonial[]` - 用户评价数据数组（可选，有默认数据）
- `title?: string` - 标题（默认: "What Our Users Say"）
- `columns?: number` - 列数（默认: 4）
- `containerHeight?: string` - 容器高度（默认: "800px"）
- `className?: string` - 额外的 CSS 类名

## 自定义

你可以通过修改 `app/page.tsx` 来自定义首页内容，或者通过传递不同的 props 给 `Testimonials` 组件来调整展示效果。

