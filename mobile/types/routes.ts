export const ROUTES = {
  login: 'login',
  register: 'register',
  swipe: 'swipe',
  reportTranslation: 'reportTranslation',
  userProfile: 'userProfile',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
