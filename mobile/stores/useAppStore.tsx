import create from 'zustand';
import { ApiGetUserResponse } from '../api/api';

import { Route, ROUTES } from '../types/routes';
import { NotConfirmedTranslation, Translation } from '../types/translations';
import { Report } from '../types/reports';

type AppStoreVars = {
  currentRoute: Route;
  apiToken: string | null;
  userData: ApiGetUserResponse | null;
  reportingTranslation: Translation | null;
  notConfirmedTranslation: NotConfirmedTranslation | null;
  reportReviewData: Report | null;
};

type AppStoreFuncs = {
  changeRoute: (route: Route) => void;
  setApiToken: (newToken: string | null) => void;
  setUserData: (userData: ApiGetUserResponse | null) => void;
  setReportingTranslation: (reportingTranslation: Translation | null) => void;
  setReportReviewData: (reportReviewData: Report | null) => void;
  setNotConfirmedTranslation: (
    notConfirmedTranslation: NotConfirmedTranslation | null
  ) => void;
};

type AppStore = AppStoreVars & AppStoreFuncs;

const initialState: AppStoreVars = {
  currentRoute: ROUTES.login,
  reportingTranslation: null,
  userData: null,
  apiToken: null,
  reportReviewData: null,
  notConfirmedTranslation: null,
};

export const useAppStore = create<AppStore>()((set) => ({
  ...initialState,
  changeRoute: (route) => set({ currentRoute: route }),
  setApiToken: (newApiToken) => set({ apiToken: newApiToken }),
  setUserData: (userData) => set({ userData }),
  setReportingTranslation: (reportingTranslation) =>
    set({ reportingTranslation }),
  setReportReviewData: (reportReviewData) => set({ reportReviewData }),
  setNotConfirmedTranslation: (notConfirmedTranslation) =>
    set({ notConfirmedTranslation }),
}));
