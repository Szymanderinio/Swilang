import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Logo from '../assets/images/logo.svg';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { apiGetLanguages, apiGetUser, apiLogin } from '../api/api';
import BasicTextInput from '../components/BasicTextInput';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigators/RootNavigator';
import { getApiToken, setApiToken } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.login>;

const LoginScreen = ({ navigation }: Props) => {
  const setUserData = useAppStore((state) => state.setUserData);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const setMainLanguage = useAppStore((state) => state.setMainLanguage);

  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const apiToken = await getApiToken();

        if (apiToken) {
          const responseGetUser = await apiGetUser({ token: apiToken });
          setUserData(responseGetUser.data);
          const { data: languages } = await apiGetLanguages();
          const shortLanguage = languages?.find(
            ({ id }) => responseGetUser.data.currentLanguage === id
          )?.languageShort;
          if (shortLanguage) {
            setMainLanguage(shortLanguage);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfLoggedIn();
  }, [isLoggedIn]);

  const handleLogin = async () => {
    setError('');
    if (email.length === 0 || password.length === 0) {
      setError('You have to fill all fields!');
      return;
    }

    try {
      const responseLogin = await apiLogin({ email, password });
      const responseGetUser = await apiGetUser({
        token: responseLogin.data.key,
      });
      setUserData(responseGetUser.data);
      setApiToken(responseLogin.data.key);
      const { data: languages } = await apiGetLanguages();
      const shortLanguage = languages?.find(
        ({ id }) => responseGetUser.data.currentLanguage === id
      )?.languageShort;
      if (shortLanguage) {
        setMainLanguage(shortLanguage);
      }
    } catch (e) {
      console.error((e as any).request);
      setError('Invalid email or/and password!');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

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
        <Button title='Login' onPress={handleLogin} />
      </View>
      <Text style={styles.registerText}>New to Swilang?</Text>
      <Button
        title='Click here to register'
        onPress={() => navigation.navigate(ROUTES.register)}
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
    alignSelf: 'center',
  },
  errorText: {
    color: Colors.negativeColor,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
  },
});

export default LoginScreen;
