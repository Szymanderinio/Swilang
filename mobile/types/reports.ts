import { ReportType } from './swipes';

export type Report = {
  id: number;
  reportType: typeof ReportType[keyof typeof ReportType];
  comment: string | null;
  createdAt: string;
  isSolved: boolean;
  user: number;
  translation: number;
};
