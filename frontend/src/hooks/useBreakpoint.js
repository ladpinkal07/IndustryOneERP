import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

function getBreakpoint(width) {
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

export function useBreakpoint() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [breakpoint, setBreakpoint] = useState(() =>
    getBreakpoint(typeof window !== 'undefined' ? window.innerWidth : 1200)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWindowSize({ width: w, height: h });
      setBreakpoint(getBreakpoint(w));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < BREAKPOINTS.md;
  const isTablet = windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg;
  const isDesktop = windowSize.width >= BREAKPOINTS.lg;
  const isWide = windowSize.width >= BREAKPOINTS.xl;

  return {
    breakpoint,
    windowWidth: windowSize.width,
    windowHeight: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    isXxl: breakpoint === 'xxl',
  };
}
