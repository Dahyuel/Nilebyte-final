import Lenis from 'lenis';

let lenis: Lenis | null = null;

export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return;

  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return () => {
    lenis?.destroy();
    lenis = null;
  };
};

export const scrollTo = (target: string | number, options?: { offset?: number }) => {
  if (!lenis) return;

  const offset = options?.offset ?? 0;
  const element = typeof target === 'string' ? document.querySelector(target) : null;
  const position = element ? element.getBoundingClientRect().top + window.scrollY + offset : target;

  lenis.scrollTo(position, {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
}; 