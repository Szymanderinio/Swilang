import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import BasicTextInput from '../components/BasicTextInput';
import {
  ApiPostTranslationRequest,
  apiGetLanguages,
  apiPostAutoTranslate,
  apiPostTranslation,
} from '../api/api';
import { Language } from '../types/translations';
import { RootStackParamList } from '../navigators/RootNavigator';
import Dropdown from '../components/Dropdown';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.addTranslation
>;

export default function AddTranslationScreen({ navigation }: Props) {
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);
  const [translation, setTranslation] = useState<string>('');
  const [word, setWord] = useState<string>('');
  const [isLoadingAutoTranslate, setIsLoadingAutoTranslate] =
    useState<boolean>(false);
  const [isLoadingAddTranslation, setIsLoadingAddTranslation] =
    useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isAutoTranslated, setIsAutoTranslated] = useState<boolean>(false);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const response = await apiGetLanguages();
        if (response.status === 200) {
          setLanguages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLanguages();
  }, []);

  const handleAddTranslation = async () => {
    if (!selectedLanguage || translation === '' || word === '') {
      return;
    }

    try {
      setIsLoadingAddTranslation(true);
      const newTranslationPayload: ApiPostTranslationRequest = {
        newTranslation: {
          autoTranslated: isAutoTranslated,
          language: selectedLanguage,
          word,
          translatedWord: translation,
        },
      };

      const response = await apiPostTranslation(newTranslationPayload);

      if (response.status === 201) {
        navigation.navigate(ROUTES.adminPanel);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAddTranslation(false);
    }
  };

  const handleAutoTranslate = async () => {
    if (!selectedLanguage || word === '') {
      return;
    }

    try {
      setIsLoadingAutoTranslate(true);

      const languageShort = languages.find(
        ({ language }) => language === selectedLanguage
      )?.languageShort;

      if (!languageShort) {
        return;
      }
      const response = await apiPostAutoTranslate({
        languageShort,
        word,
      });

      if (response.status === 200) {
        const { value } = response.data;
        setTranslation(value);
        setIsAutoTranslated(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAutoTranslate(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Add translation</Text>
        <View style={Platform.OS !== 'android' ? { zIndex: 2 } : null}>
          <BasicTextInput
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Word'
            onChangeText={setWord}
            defaultValue={word}
          />
          <Dropdown
            items={languages.map(({ language }) => ({
              label: language,
              value: language,
            }))}
            multiple={false}
            value={selectedLanguage}
            setValue={setSelectedLanguage}
            setOpen={setOpenLanguageDropdown}
            open={openLanguageDropdown}
            placeholder='Select language'
          />
          <BasicButton
            title={'Auto translate'}
            style={styles.button}
            onPress={handleAutoTranslate}
            disabled={word === '' || !selectedLanguage}
            isLoading={isLoadingAutoTranslate}
          />
          <BasicTextInput
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Translation'
            onChangeText={setTranslation}
            defaultValue={translation}
            onChange={() => setIsAutoTranslated(false)}
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => navigation.navigate(ROUTES.adminPanel)}
            style={styles.button}
          />
          <BasicButton
            title={'Add translation'}
            style={styles.button}
            onPress={handleAddTranslation}
            disabled={
              !selectedLanguage ||
              translation === '' ||
              word === '' ||
              isLoadingAddTranslation
            }
            isLoading={isLoadingAddTranslation}
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
    marginBottom: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
