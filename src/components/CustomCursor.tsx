import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const isClicking = useRef(false);
  const isHovering = useRef(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      isClicking.current = true;
      if (cursorRef.current) {
        cursorRef.current.classList.add('clicking');
      }
    };

    const handleMouseUp = () => {
      isClicking.current = false;
      if (cursorRef.current) {
        cursorRef.current.classList.remove('clicking');
      }
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
      if (cursorRef.current) {
        cursorRef.current.classList.add('hovering');
      }
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      if (cursorRef.current) {
        cursorRef.current.classList.remove('hovering');
      }
    };

    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Animation loop for smooth cursor following
    const animateCursor = () => {
      const ease = 0.15;
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * ease;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 15}px, ${cursorPos.current.y - 15}px)`;
      }

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="custom-cursor fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, #3B82F6 30%, #14B8A6 100%)',
        borderRadius: '50%',
        filter: 'blur(1px)',
        transition: 'all 0.1s ease-out'
      }}
    />
  );
};

export default CustomCursor;