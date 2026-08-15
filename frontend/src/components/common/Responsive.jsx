import React from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export function ShowOn({ at, children }) {
  const bp = useBreakpoint();

  let shouldShow = false;
  if (at === 'mobile' && bp.isMobile) shouldShow = true;
  if (at === 'tablet' && bp.isTablet) shouldShow = true;
  if (at === 'desktop' && bp.isDesktop) shouldShow = true;
  if (at === 'wide' && bp.isWide) shouldShow = true;

  // Exact breakpoint matches
  if (Array.isArray(at)) {
    shouldShow = at.includes(bp.breakpoint);
  } else if (typeof at === 'string' && at.startsWith('above-')) {
    const target = at.replace('above-', '');
    if (target === 'mobile' && !bp.isMobile) shouldShow = true;
    if (target === 'tablet' && (bp.isDesktop || bp.isWide)) shouldShow = true;
  }

  if (!shouldShow) return null;
  return <>{children}</>;
}

export function HideOn({ at, children }) {
  const bp = useBreakpoint();

  let shouldHide = false;
  if (at === 'mobile' && bp.isMobile) shouldHide = true;
  if (at === 'tablet' && bp.isTablet) shouldHide = true;
  if (at === 'desktop' && bp.isDesktop) shouldHide = true;
  if (at === 'wide' && bp.isWide) shouldHide = true;

  if (Array.isArray(at)) {
    shouldHide = at.includes(bp.breakpoint);
  }

  if (shouldHide) return null;
  return <>{children}</>;
}
