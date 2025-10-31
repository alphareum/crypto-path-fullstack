import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.getAttribute('role') === 'button';

      setIsHovering(isInteractive);
    };

    const animate = () => {
      // Smooth follow for outer cursor (slower)
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      // Faster follow for dot
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Outer cursor ring */}
      <div
        ref={cursorRef}
        className={`hidden lg:block fixed top-0 left-0 w-8 h-8 border-2 border-primary/40 rounded-full pointer-events-none z-[9999] transition-all duration-300 ${
          isHovering ? 'scale-150 border-primary' : 'scale-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Inner cursor dot */}
      <div
        ref={cursorDotRef}
        className={`hidden lg:block fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[9999] transition-all duration-150 ${
          isHovering ? 'scale-0' : 'scale-100'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};

export default CustomCursor;
