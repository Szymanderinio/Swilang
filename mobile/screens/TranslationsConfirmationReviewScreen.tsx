import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Colors } from '../constants/colors';
import BasicButton, { ButtonType } from '../components/BasicButton';
import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { apiPatchTranslation } from '../api/api';
import { apiDeleteTranslation } from '../api/api';
import { RootStackParamList } from '../navigators/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.translationConfirmationReview
>;

export default function TranslationConfirmationReviewScreen({
  navigation,
}: Props) {
  const setEditTranslationData = useAppStore(
    (state) => state.setEditTranslationData
  );
  const notConfirmedTranslation = useAppStore(
    (state) => state.notConfirmedTranslation
  );

  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleAcceptTranslation = async () => {
    if (notConfirmedTranslation === null) {
      return;
    }

    try {
      setIsLoadingAccept(true);

      const response = await apiPatchTranslation({
        translationData: {
          isConfirmed: true,
        },
        translationID: notConfirmedTranslation.id,
      });

      if (response.status === 200) {
        navigation.navigate(ROUTES.translationConfirmationList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAccept(false);
    }
  };

  const handleDeleteTranslation = async () => {
    if (notConfirmedTranslation === null) {
      return;
    }

    try {
      setIsLoadingDelete(true);

      const response = await apiDeleteTranslation({
        translationID: notConfirmedTranslation.id,
      });

      if (response.status === 204) {
        navigation.navigate(ROUTES.translationConfirmationList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleEditTranslation = () => {
    if (!notConfirmedTranslation?.id) {
      return;
    }

    setEditTranslationData({
      translationId: notConfirmedTranslation.id,
      returnScreen: ROUTES.translationConfirmationList,
    });
    navigation.navigate(ROUTES.editTranslation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View>
          <View style={styles.translationConfirmationItem}>
            <Text style={styles.translationText}>
              Original word:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {notConfirmedTranslation?.wordText}
              </Text>
            </Text>
            <Text style={styles.translationText}>
              Translation:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {notConfirmedTranslation?.translatedWord}
              </Text>
            </Text>
            <Text style={styles.translationText}>
              Language:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {notConfirmedTranslation?.languageText}
              </Text>
            </Text>
            {notConfirmedTranslation?.createdAt && (
              <Text style={styles.translationText}>
                Translation created at:{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {new Date(notConfirmedTranslation.createdAt).toLocaleString()}
                </Text>
              </Text>
            )}
          </View>
        </View>
        <View style={styles.buttonsVertical}>
          <BasicButton
            title='Accept translation'
            type={ButtonType.accept}
            onPress={handleAcceptTranslation}
            style={styles.buttonVertical}
            isLoading={isLoadingAccept}
          />
          <BasicButton
            title='Edit translation'
            type={ButtonType.info}
            onPress={handleEditTranslation}
            style={styles.buttonVertical}
          />
          <BasicButton
            title='Remove translation'
            type={ButtonType.report}
            onPress={handleDeleteTranslation}
            style={styles.buttonVertical}
            isLoading={isLoadingDelete}
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
    height: '60%',
    display: 'flex',
    justifyContent: 'space-between',
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
  translationConfirmationItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  translationConfirmationItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
  translationText: {
    fontSize: 22,
    lineHeight: 34,
  },
});
