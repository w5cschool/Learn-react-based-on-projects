import { useState, useEffect } from "react";

/**
 * 练习 1：基础理解 - Logger 组件
 * 每 1 秒钟随机生成一个 1~100 的数字，通过 render props 传递给外部
 */
export default function Logger({ render }) {
  const [num, setNum] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setNum(Math.floor(Math.random() * 100) + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <>{render(num)}</>;
}

