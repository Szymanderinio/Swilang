import axios from 'axios';

import { Translation } from '../types/translations';
import { TranslationAction } from '../types/swipes';
import { useAppStore } from '../stores/useAppStore';

const API_URL = 'http://localhost:8000';

const apiServer = axios.create({
  baseURL: API_URL,
  timeout: 2000,
});

// POST /auth/login/
type ApiLoginRequest = {
  email: string;
  password: string;
};
type ApiLoginResponse = {
  key: string;
};
export const apiLogin = (data: ApiLoginRequest) =>
  apiServer.post<ApiLoginResponse>('/auth/login/', data);

// POST /auth/create/
type ApiRegisterRequest = {
  email: string;
  password: string;
};
type ApiRegisterResponse = {
  pk: number;
  email: string;
};
export const apiRegister = (data: ApiRegisterRequest) =>
  apiServer.post<ApiRegisterResponse>('/auth/create/', data);

// GET /translations/
type ApiGetTranslationsRequest = {
  language?: string;
};
type ApiGetTranslationsResponse = Translation[];
export const apiGetTranslations = (props?: ApiGetTranslationsRequest) =>
  apiServer.get<ApiGetTranslationsResponse>(
    `/translations/${props?.language ? `?lng=${props.language}` : ''}`,
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );

// POST /translations/<translationID>/action/
type ApiSendActionRequest = {
  actionType: typeof TranslationAction[keyof typeof TranslationAction];
  translationID: number;
};
type ApiSendActionResponse = never;
export const apiSendActionTranslations = (props: ApiSendActionRequest) =>
  apiServer.post<ApiSendActionResponse>(
    `/translations/${props.translationID}/action/`,
    { actionType: props.actionType },
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );
