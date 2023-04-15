import axios from 'axios';

import {
  Language,
  NotConfirmedTranslation,
  Translation,
  TranslationDetails,
  TranslationFull,
  Word,
} from '../types/translations';
import { ReportType, TranslationAction } from '../types/swipes';
import { Report } from '../types/reports';
import { getApiToken } from '../utils/storage';

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
export const apiLogin = async (data: ApiLoginRequest) =>
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
export const apiRegister = async (data: ApiRegisterRequest) =>
  apiServer.post<ApiRegisterResponse>('/auth/create/', data);

// GET /languages/
type ApiGetLanguagesResponse = Language[];
export const apiGetLanguages = async () =>
  apiServer.get<ApiGetLanguagesResponse>(`/languages/`);

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
export const apiGetUser = async () =>
  apiServer.get<ApiGetUserResponse>('/auth/user/', {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
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
export const apiUpdateUser = async (data: ApiUpdateUserRequest) =>
  apiServer.patch<ApiUpdateUserResponse>('/auth/user/', data, {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
    },
  });

// GET /translations/
type ApiGetTranslationsRequest = {
  language?: string;
};
type ApiGetTranslationsResponse = Translation[];
export const apiGetTranslations = async (props?: ApiGetTranslationsRequest) =>
  apiServer.get<ApiGetTranslationsResponse>(
    `/translations/${props?.language ? `?lng=${props.language}` : ''}`,
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
      },
    }
  );

// GET /translations/not_confirmed/
type ApiGetNotConfirmedTranslationsResponse = NotConfirmedTranslation[];
export const apiGetNotConfirmedTranslations = async () =>
  apiServer.get<ApiGetNotConfirmedTranslationsResponse>(
    `translations/not_confirmed/`,
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
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
export const apiPostTranslation = async (props: ApiPostTranslationRequest) =>
  apiServer.post<ApiPostTranslationsResponse>(
    `/translations/`,
    props.newTranslation,
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
      },
    }
  );

// PATCH /translations/
export type ApiPatchTranslationRequest = {
  translationData: Omit<Partial<TranslationDetails>, 'id'>;
  translationID: number;
};
type ApiPatchTranslationsResponse = TranslationDetails;
export const apiPatchTranslation = async (props: ApiPatchTranslationRequest) =>
  apiServer.patch<ApiPatchTranslationsResponse>(
    `/translations/${props.translationID}/`,
    props.translationData,
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
      },
    }
  );

// GET /translations/<translationID>
type ApiGetTranslationDetailsRequest = {
  translationID: number;
};
export const apiGetTranslationDetails = async (
  props: ApiGetTranslationDetailsRequest
) =>
  apiServer.get<Translation>(`/translations/${props.translationID}/`, {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
    },
  });

// DELETE /translations/<translationID>
type ApiDeleteTranslationRequest = {
  translationID: number;
};
export const apiDeleteTranslation = async (
  props: ApiDeleteTranslationRequest
) =>
  apiServer.delete<Translation>(`/translations/${props.translationID}/`, {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
    },
  });

// POST /translations/<translationID>/action/
type ApiSendActionRequest = {
  actionType: typeof TranslationAction[keyof typeof TranslationAction];
  translationID: number;
};
type ApiSendActionResponse = never;
export const apiSendActionTranslations = async (props: ApiSendActionRequest) =>
  apiServer.post<ApiSendActionResponse>(
    `/translations/${props.translationID}/action/`,
    { actionType: props.actionType },
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
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
export const apiSendReportTranslations = async (props: ApiSendReportRequest) =>
  apiServer.post<ApiSendReportResponse>(
    `/translations/${props.translationID}/report/`,
    { reportType: props.reportType, comment: props.comment },
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
      },
    }
  );

// GET /words/
type ApiGetWordsResponse = Word[];
export const apiGetWords = async () =>
  apiServer.get<ApiGetWordsResponse>(`/words/`, {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
    },
  });

// POST /words/
export type ApiPostWordRequest = {
  newWord: Omit<Word, 'id' | 'addedBy' | 'createdAt' | 'isConfirmed'>;
};
type ApiPostWordResponse = Word;
export const apiPostWord = async (props: ApiPostWordRequest) =>
  apiServer.post<ApiPostWordResponse>(`/words/`, props.newWord, {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
    },
  });

// PATCH /words/
export type ApiPatchWordRequest = {
  wordData: Omit<Partial<Word>, 'id' | 'addedBy' | 'createdAt'>;
  wordID: number;
};
type ApiPatchWordResponse = Word;
export const apiPatchWord = async (props: ApiPatchWordRequest) =>
  apiServer.patch<ApiPatchWordResponse>(
    `/words/${props.wordID}/`,
    props.wordData,
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
      },
    }
  );

// GET /reports/
type ApiGetReportsResponse = Report[];
export const apiGetReports = async () =>
  apiServer.get<ApiGetReportsResponse>(`/reports/`, {
    headers: {
      Authorization: `Token ${await getApiToken()}`,
    },
  });

// PATCH /reports/<reportID>/
type ApiPatchReportRequest = {
  report: Partial<Report>;
  reportId: number;
};
type ApiPatchReportResponse = Report;
export const apiPatchReport = async (props: ApiPatchReportRequest) =>
  apiServer.patch<ApiPatchReportResponse>(
    `/reports/${props.reportId}/`,
    props.report,
    {
      headers: {
        Authorization: `Token ${await getApiToken()}`,
      },
    }
  );
