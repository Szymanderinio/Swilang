import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import { ReportTypeMap } from '../types/swipes';
import { TranslationDetails } from '../types/translations';
import {
  apiDeleteTranslation,
  apiGetTranslationDetails,
  apiPatchReport,
} from '../api/api';
import { RootStackParamList } from '../navigators/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.reportReview
>;

export default function ReportReviewScreen({ navigation }: Props) {
  const setEditTranslationData = useAppStore(
    (state) => state.setEditTranslationData
  );
  const reportReviewData = useAppStore((state) => state.reportReviewData);
  const [translation, setTranslation] = useState<TranslationDetails | null>(
    null
  );
  const [isLoadingResolve, setIsLoadingResolve] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

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
    setIsLoadingResolve(true);

    try {
      const response = await apiPatchReport({
        report: { isSolved: true },
        reportId: reportReviewData.id,
      });

      if (response.status === 200) {
        navigation.navigate(ROUTES.reportList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingResolve(false);
    }
  };

  const handleDeleteTranslation = async () => {
    if (reportReviewData === null) {
      return;
    }
    setIsLoadingDelete(true);

    try {
      const response = await apiDeleteTranslation({
        translationID: reportReviewData.translation,
      });

      if (response.status === 204) {
        navigation.navigate(ROUTES.reportList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleEditTranslation = () => {
    if (!reportReviewData?.translation) {
      return;
    }

    setEditTranslationData({
      translationId: reportReviewData?.translation,
      returnScreen: ROUTES.reportReview,
    });
    navigation.navigate(ROUTES.editTranslation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Report Review</Text>
        <View>
          <Text style={styles.reportItemTitle}>Reported translation:</Text>
          <View style={styles.reportItem}>
            <Text>
              Original word:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {translation?.wordText}
              </Text>
            </Text>
            <Text>
              Translation:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {translation?.translatedWord}
              </Text>
            </Text>
            {reportReviewData?.createdAt && (
              <Text>
                Report created at:{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {new Date(reportReviewData.createdAt).toLocaleString()}
                </Text>
              </Text>
            )}
            {reportReviewData?.reportType !== undefined ? (
              <Text>
                Type:{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {ReportTypeMap[reportReviewData.reportType]}
                </Text>
              </Text>
            ) : null}
            <Text>
              Comment:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {reportReviewData?.comment ?? '-'}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.buttonsVertical}>
          <BasicButton
            title='Resolve report'
            type={ButtonType.accept}
            onPress={handleResolveReport}
            style={styles.buttonVertical}
            isLoading={isLoadingResolve}
          />
          <BasicButton
            title='Edit translation'
            type={ButtonType.info}
            onPress={handleEditTranslation}
            style={styles.buttonVertical}
          />
          <BasicButton
            title='Delete translation'
            type={ButtonType.report}
            onPress={handleDeleteTranslation}
            style={styles.buttonVertical}
            isLoading={isLoadingDelete}
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => navigation.navigate(ROUTES.reportList)}
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
