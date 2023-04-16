import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { apiGetTranslationDetails, apiPatchTranslation } from '../api/api';
import { TranslationDetails } from '../types/translations';
import BasicTextInput from '../components/BasicTextInput';
import { RootStackParamList } from '../navigators/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.editTranslation
>;

export default function EditTranslationScreen({ navigation }: Props) {
  const editTranslationData = useAppStore((state) => state.editTranslationData);

  const [translation, setTranslation] = useState<TranslationDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [translatedWord, setTranslatedWord] = useState<string>('');

  useEffect(() => {
    const fetchTranslation = async () => {
      if (editTranslationData === null) {
        return;
      }

      try {
        setIsLoading(true);

        const response = await apiGetTranslationDetails({
          translationID: editTranslationData.translationId,
        });
        setTranslation(response.data);
        setTranslatedWord(response.data.translatedWord);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();
  }, []);

  const handleEditTranslation = async () => {
    if (
      !editTranslationData ||
      translatedWord === '' ||
      translatedWord === translation?.translatedWord
    ) {
      return;
    }

    try {
      setIsLoadingSave(true);
      const response = await apiPatchTranslation({
        translationData: {
          translatedWord,
        },
        translationID: editTranslationData.translationId,
      });

      if (response.status === 200) {
        navigation.navigate(editTranslationData.returnScreen);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  if (editTranslationData === null) {
    navigation.navigate(ROUTES.swipe);
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Edit translation</Text>
        <View>
          <View style={styles.editTranslationItem}>
            <Text style={styles.editTranslationItemTitle}>
              Original word:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {translation?.wordText}
              </Text>
            </Text>
            {translation?.createdAt && (
              <Text style={styles.editTranslationItemTitle}>
                Created at:{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {new Date(translation.createdAt).toLocaleString()}
                </Text>
              </Text>
            )}
            <Text style={styles.editTranslationItemTitle}>
              Is confirmed:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {translation?.isConfirmed ? 'Yes' : 'No'}
              </Text>
            </Text>
            <Text style={styles.editTranslationItemTitle}>Translation:</Text>
            <BasicTextInput
              style={styles.input}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='Translation'
              onChangeText={setTranslatedWord}
              defaultValue={translatedWord}
            />
          </View>
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() =>
              navigation.navigate(editTranslationData.returnScreen)
            }
            style={styles.button}
          />
          <BasicButton
            title='Edit'
            style={styles.button}
            onPress={handleEditTranslation}
            disabled={
              translatedWord === '' ||
              translatedWord === translation?.translatedWord
            }
            isLoading={isLoadingSave}
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
  button: {
    marginHorizontal: 10,
  },
  editTranslationItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  editTranslationItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
  input: {
    marginTop: 10,
  },
});
