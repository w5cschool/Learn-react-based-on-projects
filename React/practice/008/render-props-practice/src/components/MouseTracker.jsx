import { useState, useEffect } from "react";

/**
 * 练习 2：复用逻辑 - MouseTracker 组件
 * 通过 render props 共享鼠标坐标
 */
export default function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <>{render(position)}</>;
}

