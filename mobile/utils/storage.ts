import { API_TOKEN_KEY, MAIN_LANGUAGE_KEY } from '../constants/storageKeys';
import { asyncStorage } from '../stores/asyncStorage';

export const getApiToken = async () => {
  try {
    const token = await asyncStorage.getData(API_TOKEN_KEY);
    return token;
  } catch (e) {
    return null;
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
    return null;
  }
};
