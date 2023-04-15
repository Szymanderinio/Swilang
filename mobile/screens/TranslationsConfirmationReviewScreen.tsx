import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../constants/colors';
import BasicButton, { ButtonType } from '../components/BasicButton';
import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { apiPatchTranslation } from '../api/api';
import { apiDeleteTranslation } from '../api/api';

export default function TranslationConfirmationReviewScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);
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
        changeRoute(ROUTES.translationConfirmationList);
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
        changeRoute(ROUTES.translationConfirmationList);
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
    changeRoute(ROUTES.editTranslation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Translation Confirmation Review</Text>
        <View>
          <Text style={styles.translationConfirmationItemTitle}>
            Translation:
          </Text>
          <View style={styles.translationConfirmationItem}>
            <Text>Original word: {notConfirmedTranslation?.wordText}</Text>
            <Text>Translation: {notConfirmedTranslation?.translatedWord}</Text>
            <Text>Language: {notConfirmedTranslation?.languageText}</Text>
            {notConfirmedTranslation?.createdAt && (
              <Text>
                Translation created at:{' '}
                {new Date(notConfirmedTranslation.createdAt).toLocaleString()}
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
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => changeRoute(ROUTES.translationConfirmationList)}
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
  translationConfirmationItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  translationConfirmationItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
});
