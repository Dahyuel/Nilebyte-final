import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastScrollTop = useRef(0);
  const animatedElements = useRef(new Set<HTMLElement>());
  const sectionVisibilityRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      
      // Track scroll direction
      if (st > lastScrollTop.current) {
        document.body.classList.remove('is-scrolling-up');
      } else {
        document.body.classList.add('is-scrolling-up');
      }
      lastScrollTop.current = st <= 0 ? 0 : st;

      // Check all sections for visibility
      const sections = document.querySelectorAll('section[id]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0;
        const sectionId = section.id;
        const wasVisible = sectionVisibilityRef.current.get(sectionId);

        // If section just came into view or went out of view
        if (isVisible !== wasVisible) {
          sectionVisibilityRef.current.set(sectionId, isVisible);
          
          // If section just came into view, reset its animations
          if (isVisible) {
            const sectionElements = section.querySelectorAll('.scroll-animate');
            sectionElements.forEach((element) => {
              const el = element as HTMLElement;
              // Remove from animated set to allow re-animation
              animatedElements.current.delete(el);
              // Reset styles with slower initial values
              el.classList.remove('in-view');
              el.style.transform = 'translateY(30px)';
              el.style.opacity = '0';
              el.style.filter = 'blur(8px)';
              // Add transition properties for smoother animation
              el.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
              // Re-observe the element
              if (observerRef.current) {
                observerRef.current.unobserve(el);
                observerRef.current.observe(el);
              }
            });
          }
        }
      });

      // Update progress-based animations for elements not in view
      const elements = document.querySelectorAll('.scroll-animate:not(.in-view)');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Slower progression for scroll-based animations
        const scrollProgress = Math.min(
          Math.max(
            (viewportHeight - elementTop) / (viewportHeight + elementHeight * 2),
            0
          ),
          1
        );

        if (scrollProgress > 0) {
          const elementStyle = element as HTMLElement;
          // Slower transform with easing
          const translateY = Math.max(30 * Math.pow(1 - scrollProgress, 1.5), 0);
          // Slower fade in with easing
          const opacity = Math.min(Math.pow(scrollProgress, 1.2) * 1.2, 1);
          // Slower blur reduction with easing
          const blur = Math.max(8 * Math.pow(1 - scrollProgress, 2), 0);
          
          elementStyle.style.transform = `translateY(${translateY}px)`;
          elementStyle.style.opacity = opacity.toString();
          elementStyle.style.filter = `blur(${blur}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          
          if (entry.isIntersecting && !animatedElements.current.has(element)) {
            element.classList.add('in-view');
            // Slower animation when element comes into view
            setTimeout(() => {
              element.style.transform = 'translateY(0)';
              element.style.opacity = '1';
              element.style.filter = 'blur(0)';
            }, 100);

            animatedElements.current.add(element);

            if (element.classList.contains('stagger-children')) {
              const children = Array.from(element.children);
              children.forEach((child, index) => {
                const childElement = child as HTMLElement;
                if (!animatedElements.current.has(childElement)) {
                  // Increased delay between staggered children
                  setTimeout(() => {
                    childElement.style.transitionDelay = `${index * 0.25}s`;
                    childElement.style.transform = 'translateY(0)';
                    childElement.style.opacity = '1';
                    childElement.style.filter = 'blur(0)';
                    animatedElements.current.add(childElement);
                  }, 150);
                }
              });
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-10% 0px -10% 0px' // Reduced margin for earlier animation start
      }
    );

    observerRef.current = observer;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const observeElements = (elements: HTMLElement[]) => {
    elements.forEach((element) => {
      if (element && !animatedElements.current.has(element)) {
        // Add initial transition properties
        element.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        observerRef.current?.observe(element);
      }
    });
  };

  return { observeElements };
};