export const TranslationAction = {
  SWIPE_LEFT: 0,
  SWIPE_RIGHT: 1,
  REPORT: 2,
} as const;

export const ReportType = {
  BAD_TRANSLATION: 0,
  OFFENSIVE_WORD: 1,
  OTHER: 2,
} as const;

export const ReportTypeMap = {
  0: 'Bad translation',
  1: 'Offensive word',
  2: 'Other',
} as const;
