import { API_TOKEN_KEY } from '../constants/auth';
import { asyncStorage } from '../stores/asyncStorage';

export const getApiToken = async () => {
  try {
    const token = await asyncStorage.getData(API_TOKEN_KEY);
    return token;
  } catch (e) {
    return null;
  }
};
