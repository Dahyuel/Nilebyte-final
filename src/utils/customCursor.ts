import { useEffect, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  scale: number;
  targetScale: number;
  opacity: number;
  targetOpacity: number;
}

export const useCustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorCircleRef = useRef<HTMLDivElement>(null);
  const state = useRef<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scale: 1,
    targetScale: 1,
    opacity: 1,
    targetOpacity: 1,
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorCircle = cursorCircleRef.current;
    if (!cursor || !cursorDot || !cursorCircle) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      state.current.targetX = e.clientX;
      state.current.targetY = e.clientY;
    };

    // Mouse enter/leave handlers for interactive elements
    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.classList.contains('interactive') ||
        target.closest('.interactive')
      ) {
        state.current.targetScale = 2;
        state.current.targetOpacity = 0.5;
        cursor.classList.add('cursor-hover');
      }
    };

    const onMouseLeave = () => {
      state.current.targetScale = 1;
      state.current.targetOpacity = 1;
      cursor.classList.remove('cursor-hover');
    };

    // Animation loop
    const animate = () => {
      // Smooth cursor movement
      state.current.x += (state.current.targetX - state.current.x) * 0.2;
      state.current.y += (state.current.targetY - state.current.y) * 0.2;
      state.current.scale += (state.current.targetScale - state.current.scale) * 0.2;
      state.current.opacity += (state.current.targetOpacity - state.current.opacity) * 0.2;

      // Apply transforms
      cursor.style.transform = `translate(${state.current.x}px, ${state.current.y}px)`;
      cursorDot.style.transform = `scale(${state.current.scale})`;
      cursorCircle.style.transform = `scale(${state.current.scale})`;
      cursorCircle.style.opacity = state.current.opacity.toString();

      requestAnimationFrame(animate);
    };

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter, true);
    document.addEventListener('mouseleave', onMouseLeave, true);

    // Start animation
    animate();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter, true);
      document.removeEventListener('mouseleave', onMouseLeave, true);
      document.body.style.cursor = '';
    };
  }, []);

  return { cursorRef, cursorDotRef, cursorCircleRef };
}; 