export type Translation = {
  id: number;
  wordText: string;
  translatedWord: string;
  languageText: string;
};

export type TranslationFull = {
  id: number;
  word: string;
  translatedWord: string;
  language: string;
  isConfirmed: boolean;
  autoTranslated: boolean;
  createdBy: number;
  createdAt: string;
};

export type NotConfirmedTranslation = {
  id: number;
  word: number;
  wordText: string;
  translatedWord: string;
  languageText: string;
  languageShortText: string;
  language: number;
  isConfirmed: boolean;
  createdBy: string;
  createdAt: string;
};

export type TranslationDetails = Translation & {
  word: number;
  languageShortText: string;
  language: number;
  isConfirmed: boolean;
  createdBy: string;
  createdAt: string;
};

export type Word = {
  id: number;
  word: string;
  isConfirmed: boolean;
  createdAt: string;
  addedBy: string;
};

export type Language = {
  id: number;
  language: string;
  languageShort: string;
};
