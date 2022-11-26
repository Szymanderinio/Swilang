import create from 'zustand';

import { Route, ROUTES } from '../types/routes';

type AppStoreVars = {
  currentRoute: Route;
  apiToken: string | null;
};

type AppStoreFuncs = {
  changeRoute: (route: Route) => void;
  setApiToken: (newToken: string) => void;
};

type AppStore = AppStoreVars & AppStoreFuncs;

const initialState: AppStoreVars = {
  currentRoute: ROUTES.login,
  apiToken: null,
};

export const useAppStore = create<AppStore>()((set) => ({
  ...initialState,
  changeRoute: (route) => set({ currentRoute: route }),
  setApiToken: (newApiToken) => set({ apiToken: newApiToken }),
}));
