import create from 'zustand';
import { ApiGetUserResponse } from '../api/api';

import { Route } from '../types/routes';
import { NotConfirmedTranslation, Translation } from '../types/translations';
import { Report } from '../types/reports';

type EditTranslationData = {
  translationId: number;
  returnScreen: Route;
};

type AppStoreVars = {
  isLoggedIn: boolean;
  userData: ApiGetUserResponse | null;
  reportingTranslation: Translation | null;
  notConfirmedTranslation: NotConfirmedTranslation | null;
  reportReviewData: Report | null;
  editTranslationData: EditTranslationData | null;
  mainLanguage: string | null;
};

type AppStoreFuncs = {
  setUserData: (userData: ApiGetUserResponse | null) => void;
  setReportingTranslation: (reportingTranslation: Translation | null) => void;
  setReportReviewData: (reportReviewData: Report | null) => void;
  setNotConfirmedTranslation: (
    notConfirmedTranslation: NotConfirmedTranslation | null
  ) => void;
  setEditTranslationData: (
    editTranslationData: EditTranslationData | null
  ) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setMainLanguage: (mainLanguage: string | null) => void;
};

type AppStore = AppStoreVars & AppStoreFuncs;

const initialState: AppStoreVars = {
  reportingTranslation: null,
  userData: null,
  reportReviewData: null,
  notConfirmedTranslation: null,
  editTranslationData: null,
  isLoggedIn: false,
  mainLanguage: null,
};

export const useAppStore = create<AppStore>()((set) => ({
  ...initialState,
  setUserData: (userData) => set({ userData }),
  setReportingTranslation: (reportingTranslation) =>
    set({ reportingTranslation }),
  setReportReviewData: (reportReviewData) => set({ reportReviewData }),
  setNotConfirmedTranslation: (notConfirmedTranslation) =>
    set({ notConfirmedTranslation }),
  setEditTranslationData: (editTranslationData) => set({ editTranslationData }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setMainLanguage: (mainLanguage) => set({ mainLanguage }),
}));
