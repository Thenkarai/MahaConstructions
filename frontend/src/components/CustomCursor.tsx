import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const mousePos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    
    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      if (hidden) setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    // Listen for hovers on clickable items to expand cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("clickable")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    let animationFrameId: number;

    const render = () => {
      // Direct position for the dot
      if (dotRef.current) {
        dotRef.current.style.left = `${mousePos.x}px`;
        dotRef.current.style.top = `${mousePos.y}px`;
      }

      // Smooth lag interpolation for the outer ring
      const ease = 0.15;
      ringPos.x += (mousePos.x - ringPos.x) * ease;
      ringPos.y += (mousePos.y - ringPos.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.x}px`;
        ringRef.current.style.top = `${ringPos.y}px`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor ${hovered ? "custom-cursor-hover" : ""}`}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-follower ${
          hovered ? "custom-cursor-follower-hover" : ""
        }`}
      />
    </>
  );
}
