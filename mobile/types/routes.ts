export const ROUTES = {
  login: 'login',
  register: 'register',
  swipe: 'swipe',
  reportTranslation: 'reportTranslation',
  userProfile: 'userProfile',
  adminPanel: 'adminPanel',
  reportList: 'reportList',
  reportReview: 'reportReview',
  addTranslation: 'addTranslation',
  translationConfirmationList: 'translationConfirmationList',
  translationConfirmationReview: 'translationConfirmationReview',
  editTranslation: 'editTranslation',
  stats: 'stats',
  home: 'home',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
