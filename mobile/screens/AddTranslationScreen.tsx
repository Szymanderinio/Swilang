import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import BasicTextInput from '../components/BasicTextInput';
import {
  ApiPostTranslationRequest,
  apiGetLanguages,
  apiPostTranslation,
} from '../api/api';
import { Language } from '../types/translations';

export default function AddTranslationScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);
  const [translation, setTranslation] = useState<string>('');
  const [word, setWord] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [toggleAutoTranslate, setToggleAutoTranslate] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);

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
    if (
      !selectedLanguage ||
      (translation === '' && !toggleAutoTranslate) ||
      word === ''
    ) {
      return;
    }
    setIsLoading(true);

    try {
      const newTranslationPayload: ApiPostTranslationRequest = {
        newTranslation: {
          autoTranslated: toggleAutoTranslate,
          language: selectedLanguage,
          word,
          translatedWord: translation,
        },
      };

      const response = await apiPostTranslation(newTranslationPayload);

      if (response.status === 201) {
        changeRoute(ROUTES.adminPanel);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={toggleAutoTranslate}
              onValueChange={(val) => {
                setTranslation('');
                setToggleAutoTranslate(val);
              }}
              color={toggleAutoTranslate ? Colors.primaryColor : undefined}
            />
            <Text style={styles.paragraph}>Auto translate</Text>
          </View>
          <View style={Platform.OS !== 'android' ? { zIndex: 1 } : null}>
            <DropDownPicker
              items={languages.map(({ language }) => ({
                label: language,
                value: language,
              }))}
              multiple={false}
              value={selectedLanguage}
              setValue={setSelectedLanguage}
              setOpen={setOpenLanguageDropdown}
              open={openLanguageDropdown}
              style={styles.dropdown}
              placeholder='Select language'
            />
          </View>
          <BasicTextInput
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Translation'
            onChangeText={setTranslation}
            defaultValue={translation}
            editable={!toggleAutoTranslate}
            selectTextOnFocus={!toggleAutoTranslate}
            style={{ opacity: toggleAutoTranslate ? 0.5 : 1 }}
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => changeRoute(ROUTES.adminPanel)}
            style={styles.button}
          />
          <BasicButton
            title='Add translation'
            style={styles.button}
            onPress={handleAddTranslation}
            isLoading={isLoading}
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
  dropdown: {
    padding: 10,
    marginBottom: 15,
    zIndex: 1000,
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
