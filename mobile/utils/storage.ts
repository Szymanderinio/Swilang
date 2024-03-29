import { API_TOKEN_KEY } from '../constants/storageKeys';
import { asyncStorage } from '../stores/asyncStorage';
import { useAppStore } from '../stores/useAppStore';

export const getApiToken = async () => {
  try {
    const token = await asyncStorage.getData(API_TOKEN_KEY);
    return token;
  } catch (e) {
    return null;
  }
};

export const setApiToken = async (token: string) => {
  try {
    await asyncStorage.storeData(token, API_TOKEN_KEY);
    useAppStore.getState().setLoggedIn(true);
  } catch (e) {
    console.error(e);
  }
};

export const removeApiToken = async () => {
  try {
    await asyncStorage.removeKey(API_TOKEN_KEY);
    useAppStore.getState().setLoggedIn(false);
  } catch (e) {
    console.error(e);
  }
};
