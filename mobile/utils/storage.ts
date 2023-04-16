import { API_TOKEN_KEY, MAIN_LANGUAGE_KEY } from '../constants/storageKeys';
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

export const getMainLanguage = async () => {
  try {
    const language =
      ((await asyncStorage.getData(MAIN_LANGUAGE_KEY)) as string) || null;
    return language;
  } catch (e) {
    return null;
  }
};

export const setMainLanguage = async (language: string) => {
  try {
    await asyncStorage.storeData(language, MAIN_LANGUAGE_KEY);
  } catch (e) {
    console.error(e);
  }
};
