import axios from 'axios';

import {
  Language,
  Translation,
  TranslationDetails,
  TranslationFull,
  Word,
} from '../types/translations';
import { ReportType, TranslationAction } from '../types/swipes';
import { useAppStore } from '../stores/useAppStore';
import { Report } from '../types/reports';

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

// POST /translations/
export type ApiPostTranslationRequest = {
  newTranslation: {
    word: string;
    language: string;
    autoTranslated: boolean;
    translatedWord?: string;
  };
};
type ApiPostTranslationsResponse = TranslationFull;
export const apiPostTranslation = (props: ApiPostTranslationRequest) =>
  apiServer.post<ApiPostTranslationsResponse>(
    `/translations/`,
    props.newTranslation,
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );

// PATCH /translations/
export type ApiPatchTranslationRequest = {
  translationData: Omit<Partial<TranslationDetails>, 'id'>;
  translationID: number;
};
type ApiPatchTranslationsResponse = TranslationDetails;
export const apiPatchTranslation = (props: ApiPatchTranslationRequest) =>
  apiServer.patch<ApiPostTranslationsResponse>(
    `/translations/${props.translationID}/`,
    props.translationData,
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );

// GET /translations/<translationID>
type ApiGetTranslationDetailsRequest = {
  translationID: number;
};
export const apiGetTranslationDetails = (
  props: ApiGetTranslationDetailsRequest
) =>
  apiServer.get<Translation>(`/translations/${props.translationID}/`, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

// DELETE /translations/<translationID>
type ApiDeleteTranslationRequest = {
  translationID: number;
};
export const apiDeleteTranslation = (props: ApiDeleteTranslationRequest) =>
  apiServer.delete<Translation>(`/translations/${props.translationID}/`, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

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

// GET /words/
type ApiGetWordsResponse = Word[];
export const apiGetWords = () =>
  apiServer.get<ApiGetWordsResponse>(`/words/`, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

// POST /words/
export type ApiPostWordRequest = {
  newWord: Omit<Word, 'id' | 'addedBy' | 'createdAt' | 'isConfirmed'>;
};
type ApiPostWordResponse = Word;
export const apiPostWord = (props: ApiPostWordRequest) =>
  apiServer.post<ApiPostWordResponse>(`/words/`, props.newWord, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

// PATCH /words/
export type ApiPatchWordRequest = {
  wordData: Omit<Partial<Word>, 'id' | 'addedBy' | 'createdAt'>;
  wordID: number;
};
type ApiPatchWordResponse = Word;
export const apiPatchWord = (props: ApiPatchWordRequest) =>
  apiServer.patch<ApiPatchWordResponse>(
    `/words/${props.wordID}/`,
    props.wordData,
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );

// GET /reports/
type ApiGetReportsResponse = Report[];
export const apiGetReports = () =>
  apiServer.get<ApiGetReportsResponse>(`/reports/`, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });

// PATCH /reports/<reportID>/
type ApiPatchReportRequest = {
  report: Partial<Report>;
  reportId: number;
};
type ApiPatchReportResponse = Report;
export const apiPatchReport = (props: ApiPatchReportRequest) =>
  apiServer.patch<ApiPatchReportResponse>(
    `/reports/${props.reportId}/`,
    props.report,
    {
      headers: {
        Authorization: `Token ${useAppStore.getState().apiToken}`,
      },
    }
  );

// GET /languages/
type ApiGetLanguagesResponse = Language[];
export const apiGetLanguages = () =>
  apiServer.get<ApiGetLanguagesResponse>(`/languages/`, {
    headers: {
      Authorization: `Token ${useAppStore.getState().apiToken}`,
    },
  });
