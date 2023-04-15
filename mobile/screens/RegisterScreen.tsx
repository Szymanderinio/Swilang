import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Button,
  Platform,
} from 'react-native';
import { apiGetLanguages, apiRegister } from '../api/api';
import BasicTextInput from '../components/BasicTextInput';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import {
  getApiToken,
  getMainLanguage,
  setMainLanguage,
} from '../utils/storage';
import { Language } from '../types/translations';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen = () => {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const mainLanguage = await getMainLanguage();
        setSelectedLanguage(mainLanguage);
      } catch (error) {
        console.log(error);
      }

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
          changeRoute(ROUTES.swipe);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfLoggedIn();
  }, []);

  const handleRegister = async () => {
    setError('');
    if (email.length === 0 || password.length === 0 || !selectedLanguage) {
      setError('You have to fill all fields!');
      return;
    }

    try {
      await apiRegister({ email, password });

      if (selectedLanguage) {
        await setMainLanguage(selectedLanguage);
      }

      changeRoute(ROUTES.login);
    } catch (e) {
      console.error(e);
      setError('Invalid email or/and password!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.logo}>Swilang</Text>
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

        <View style={Platform.OS !== 'android' ? { zIndex: 1 } : null}>
          <DropDownPicker
            items={languages.map(({ language, languageShort }) => ({
              label: language,
              value: languageShort,
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
        <Button title='Register' onPress={handleRegister} />
      </View>
      <Text style={styles.registerText}>Already have an account?</Text>
      <Button
        title='Click here to login'
        onPress={() => changeRoute(ROUTES.login)}
      />
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
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 20,
    color: Colors.primaryColor,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
  },
  dropdown: {
    padding: 10,
    marginBottom: 15,
    zIndex: 1000,
  },
});

export default RegisterScreen;
