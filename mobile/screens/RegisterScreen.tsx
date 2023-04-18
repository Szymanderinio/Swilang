import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StatusBar, StyleSheet, Button } from 'react-native';

import Logo from '../assets/images/logo.svg';
import { apiGetLanguages, apiRegister } from '../api/api';
import BasicTextInput from '../components/BasicTextInput';
import { Colors } from '../constants/colors';
import { ROUTES } from '../types/routes';
import { getApiToken } from '../utils/storage';
import { Language } from '../types/translations';
import { RootStackParamList } from '../navigators/RootNavigator';
import { useAppStore } from '../stores/useAppStore';
import Dropdown from '../components/Dropdown';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.register>;

const RegisterScreen = ({ navigation }: Props) => {
  const setMainLanguage = useAppStore((state) => state.setMainLanguage);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null);
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);

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

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const apiToken = await getApiToken();

        if (apiToken) {
          navigation.navigate(ROUTES.swipe);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfLoggedIn();
  }, []);

  const handleRegister = async () => {
    setError('');
    if (
      email.length === 0 ||
      password.length === 0 ||
      selectedLanguage === null
    ) {
      setError('You have to fill all fields!');
      return;
    }

    try {
      await apiRegister({
        email,
        password,
        current_language: selectedLanguage,
      });

      const shortSelectedLanguage = languages.find(
        (language) => language.id === selectedLanguage
      )?.languageShort;
      if (shortSelectedLanguage) {
        setMainLanguage(shortSelectedLanguage);
      }

      navigation.navigate(ROUTES.login);
    } catch (e) {
      console.error(e);
      setError('Invalid email or/and password!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Logo width={300} style={styles.logo} />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <BasicTextInput
          autoCapitalize='none'
          autoCorrect={false}
          placeholder='E-mail'
          onChangeText={setEmail}
          defaultValue={email}
        />
        <BasicTextInput
          placeholder='Password'
          onChangeText={setPassword}
          defaultValue={password}
          textContentType='password'
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry={true}
        />
        <Dropdown
          items={languages.map(({ language, id }) => ({
            label: language,
            value: id,
          }))}
          multiple={false}
          value={selectedLanguage}
          setValue={setSelectedLanguage}
          setOpen={setOpenLanguageDropdown}
          open={openLanguageDropdown}
          placeholder='Select language'
        />
        <Button title='Register' onPress={handleRegister} />
        <Text style={styles.registerText}>Already have an account?</Text>
        <Button
          title='Click here to login'
          onPress={() => navigation.navigate(ROUTES.login)}
        />
      </View>
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    justifyContent: 'center',
    width: '80%',
    height: '50%',
  },
  logo: {
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;
