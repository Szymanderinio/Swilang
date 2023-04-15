import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native';

import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { apiGetUser, apiLogin } from '../api/api';
import BasicTextInput from '../components/BasicTextInput';
import { Colors } from '../constants/colors';
import { asyncStorage } from '../stores/asyncStorage';
import { API_TOKEN_KEY } from '../constants/storageKeys';

const LoginScreen = () => {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const setUserData = useAppStore((state) => state.setUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const apiToken = await asyncStorage.getData(API_TOKEN_KEY);

        if (apiToken) {
          const responseGetUser = await apiGetUser();
          setUserData(responseGetUser.data);
          changeRoute(ROUTES.swipe);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfLoggedIn();
  }, []);

  const handleLogin = async () => {
    setError('');
    if (email.length === 0 || password.length === 0) {
      setError('You have to fill all fields!');
      return;
    }

    try {
      const responseLogin = await apiLogin({ email, password });
      asyncStorage.storeData(responseLogin.data.key, API_TOKEN_KEY);
      const responseGetUser = await apiGetUser();
      setUserData(responseGetUser.data);
      changeRoute(ROUTES.swipe);
    } catch (e) {
      console.error(e);
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
        <Button title='Login' onPress={handleLogin} />
      </View>
      <Text style={styles.registerText}>New to Swilang?</Text>
      <Button
        title='Click here to register'
        onPress={() => changeRoute(ROUTES.register)}
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
    color: Colors.negativeColor,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
  },
});

export default LoginScreen;
