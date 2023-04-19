import { Translation } from '../types/translations';
import { shuffle } from './array';

export const prepareTranslations = (translations: Translation[]) => {
  const groupedTranslations = translations.reduce((acc, translation) => {
    if (translation.knowledgeLevel in acc) {
      acc[translation.knowledgeLevel].push(translation);
    } else {
      acc[translation.knowledgeLevel] = [translation];
    }

    return acc;
  }, {} as Record<1 | 2 | 3, Translation[]>);

  Object.entries(groupedTranslations).forEach(
    ([key, value]: [unknown, Translation[]]) => {
      groupedTranslations[key as 1 | 2 | 3] = shuffle(value);
    }
  );

  const preparedTranslations = [
    ...(groupedTranslations[1] || []),
    ...(groupedTranslations[2] || []),
    ...(groupedTranslations[3] || []),
  ];

  return preparedTranslations;
};
