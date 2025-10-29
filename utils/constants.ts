/**
 * Global constants for the application
 */

export const COLORS = {
  background: '#000000',
  foreground: '#ffffff',
  yellow: '#ffed4e',
  yellowDark: '#ffd700',
  black: '#000000',
} as const;

export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.0,
  verySlow: 1.5,
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const SCROLL_CONFIG = {
  duration: 1.2,
  wheelMultiplier: 1,
  touchMultiplier: 2,
} as const;

export const THREE_CONFIG = {
  cameraFov: 50,
  cameraPosition: [0, 0, 5] as [number, number, number],
  particleCount: 1000,
  modelScale: 2,
} as const;

export const LINKS = {
  twitter: 'https://twitter.com',
  home: '#home',
  docs: '#docs',
  community: '#community',
  invest: '#invest',
} as const;

export const TICKER_DATA = {
  tvl: '2.6%',
  apr: '$38,449,783,518',
} as const;

