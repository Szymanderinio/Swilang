import create from 'zustand';
import { ApiGetUserResponse } from '../api/api';

import { Route, ROUTES } from '../types/routes';
import { NotConfirmedTranslation, Translation } from '../types/translations';
import { Report } from '../types/reports';

type EditTranslationData = {
  translationId: number;
  returnScreen: Route;
};

type AppStoreVars = {
  currentRoute: Route;
  userData: ApiGetUserResponse | null;
  reportingTranslation: Translation | null;
  notConfirmedTranslation: NotConfirmedTranslation | null;
  reportReviewData: Report | null;
  editTranslationData: EditTranslationData | null;
};

type AppStoreFuncs = {
  changeRoute: (route: Route) => void;
  setUserData: (userData: ApiGetUserResponse | null) => void;
  setReportingTranslation: (reportingTranslation: Translation | null) => void;
  setReportReviewData: (reportReviewData: Report | null) => void;
  setNotConfirmedTranslation: (
    notConfirmedTranslation: NotConfirmedTranslation | null
  ) => void;
  setEditTranslationData: (
    editTranslationData: EditTranslationData | null
  ) => void;
};

type AppStore = AppStoreVars & AppStoreFuncs;

const initialState: AppStoreVars = {
  currentRoute: ROUTES.login,
  reportingTranslation: null,
  userData: null,
  reportReviewData: null,
  notConfirmedTranslation: null,
  editTranslationData: null,
};

export const useAppStore = create<AppStore>()((set) => ({
  ...initialState,
  changeRoute: (route) => set({ currentRoute: route }),
  setUserData: (userData) => set({ userData }),
  setReportingTranslation: (reportingTranslation) =>
    set({ reportingTranslation }),
  setReportReviewData: (reportReviewData) => set({ reportReviewData }),
  setNotConfirmedTranslation: (notConfirmedTranslation) =>
    set({ notConfirmedTranslation }),
  setEditTranslationData: (editTranslationData) => set({ editTranslationData }),
}));
