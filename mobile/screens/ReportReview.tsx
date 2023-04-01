import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import { ReportTypeMap } from '../types/swipes';
import { Translation } from '../types/translations';
import {
  apiDeleteTranslation,
  apiGetTranslationDetails,
  apiPatchReport,
} from '../api/api';

export default function ReportReviewScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const reportReviewData = useAppStore((state) => state.reportReviewData);
  const [translation, setTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (reportReviewData === null) {
        return;
      }

      try {
        const response = await apiGetTranslationDetails({
          translationID: reportReviewData.translation,
        });
        setTranslation(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTranslation();
  }, []);

  const handleResolveReport = async () => {
    if (reportReviewData === null) {
      return;
    }

    try {
      const response = await apiPatchReport({
        report: { isSolved: true },
        reportId: reportReviewData.id,
      });

      if (response.status === 200) {
        changeRoute(ROUTES.reportList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTranslation = async () => {
    if (reportReviewData === null) {
      return;
    }

    try {
      const response = await apiDeleteTranslation({
        translationID: reportReviewData.translation,
      });

      if (response.status === 204) {
        changeRoute(ROUTES.reportList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Report Review</Text>
        <View>
          <Text style={styles.reportItemTitle}>Reported translation:</Text>
          <View style={styles.reportItem}>
            <Text>Original word: {translation?.wordText}</Text>
            <Text>Translation: {translation?.translatedWord}</Text>
            {reportReviewData?.createdAt && (
              <Text>
                Report created at:{' '}
                {new Date(reportReviewData.createdAt).toLocaleString()}
              </Text>
            )}
            {reportReviewData?.reportType !== undefined ? (
              <Text>Type: {ReportTypeMap[reportReviewData.reportType]}</Text>
            ) : null}
            <Text>Comment: {reportReviewData?.comment ?? '-'}</Text>
          </View>
        </View>
        <View style={styles.buttonsVertical}>
          <BasicButton
            title='Resolve report'
            type={ButtonType.accept}
            onPress={handleResolveReport}
            style={styles.buttonVertical}
          />
          <BasicButton
            title='Delete translation'
            type={ButtonType.report}
            onPress={handleDeleteTranslation}
            style={styles.buttonVertical}
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => changeRoute(ROUTES.reportList)}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  box: {
    width: '90%',
    height: '80%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.primaryColor,
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonsVertical: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonVertical: {
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  reportItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  reportItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
});
