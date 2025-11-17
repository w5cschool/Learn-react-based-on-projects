import { useState, useEffect } from "react";

/**
 * 练习 3：render props 组合 - DataProvider 组件
 * 模拟从服务器获取数据，通过 render props 传递
 */
export default function DataProvider({ render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟从服务器获取数据
    // ⚠️ 重要：这个 useEffect 只在组件挂载时执行一次（因为依赖数组是 []）
    const timer = setTimeout(() => {
      // 当 setData 和 setLoading 被调用时：
      // 1. useEffect 不会再次执行（因为依赖数组是空的）
      // 2. 但是会触发组件重新渲染（组件函数体会重新执行）
      setData("Hello React");
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []); // ← 空数组：只在挂载时执行一次

  // 🔄 关键理解：
  // useEffect 只执行一次（因为 []），但组件函数体会在状态改变时重新执行
  // 第一次渲染：loading=true, data=null → 显示"加载中..."
  // 第二次渲染（5秒后，setData/setLoading 触发）：loading=false, data="Hello React" → 显示数据
  return <>{render({ data, loading })}</>;
}

