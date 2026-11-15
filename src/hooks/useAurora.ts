import { useEffect, useRef, useState } from 'react';

/**
 * AURORA PREMIUM DESIGN SYSTEM HOOKS
 * Strictly CSS/SVG based, zero external libraries, respects prefers-reduced-motion.
 */

// =========================================================================
// 1. REVEAL HOOK (IntersectionObserver Staggered Fade Up)
// =========================================================================
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  staggerIndex?: number;
  staggerStepMs?: number;
}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = (options?.staggerIndex || 0) * (options?.staggerStepMs || 60);
            if (delay > 0) {
              const timer = setTimeout(() => setIsVisible(true), delay);
              observer.unobserve(entry.target);
              return () => clearTimeout(timer);
            }
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.staggerIndex, options?.staggerStepMs]);

  const revealStyle: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(14px)',
    transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: isVisible ? 'auto' : 'opacity, transform',
  };

  return { ref, isVisible, revealStyle };
}

// =========================================================================
// 2. COUNT-UP HOOK (600-900ms tween with decimal support)
// =========================================================================
export function useCountUp(target: number, durationMs = 800, decimals = 0): number {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target);
      return;
    }

    const start = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const val = start + (target - start) * ease;
      setCurrent(Number(val.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, durationMs, decimals]);

  return current;
}
