import axios from 'axios';

import { Translation } from '../types/translations';
import { ReportType, TranslationAction } from '../types/swipes';
import { useAppStore } from '../stores/useAppStore';

const API_URL = 'https://szyman1337.pythonanywhere.com';
// const API_URL = 'http://localhost:8000';

const apiServer = axios.create({
  baseURL: API_URL,
  timeout: 10000,
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

// ====================
// AUTHORIZED ENDPOINTS
// ====================
// GET /auth/user/
export type ApiGetUserResponse = {
  pk: number;
  email: string | null;
  isStaff: boolean;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  dateJoined: string;
};
export const apiGetUser = () =>
  apiServer.get<ApiGetUserResponse>('/auth/user/', {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

// PATCH /auth/user/
type ApiUpdateUserRequest = {
  email?: string | null;
  isStaff?: boolean | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  dateJoined?: string | null;
};
type ApiUpdateUserResponse = ApiGetUserResponse;
export const apiUpdateUser = (data: ApiUpdateUserRequest) =>
  apiServer.patch<ApiUpdateUserResponse>('/auth/user/', data, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

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

// POST /translations/<translationID>/report/
type ApiSendReportRequest = {
  reportType: typeof ReportType[keyof typeof ReportType];
  translationID: number;
  comment?: string;
};
type ApiSendReportResponse = never;
export const apiSendReportTranslations = (props: ApiSendReportRequest) =>
  apiServer.post<ApiSendReportResponse>(
    `/translations/${props.translationID}/report/`,
    { reportType: props.reportType, comment: props.comment },
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );
