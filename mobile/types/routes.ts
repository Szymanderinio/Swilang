export const ROUTES = {
  login: 'login',
  register: 'register',
  swipe: 'swipe',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
