import { useState, useEffect } from "react";

/**
 * 练习 4：理解 Hooks 替代方案
 * 用自定义 Hook 替代 MouseTracker 的 render props 模式
 */
export function useMousePosition() {
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

  return position;
}

