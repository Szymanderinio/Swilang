import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';

import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { apiLogin } from '../api/api';

const LoginScreen = () => {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const setApiToken = useAppStore((state) => state.setApiToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (useAppStore.getState().apiToken) {
    changeRoute(ROUTES.swipe);

    return null;
  }

  const handleLogin = async () => {
    setError('');
    if (email.length === 0 || password.length === 0) {
      setError('You have to fill all fields!');
      return;
    }

    try {
      const response = await apiLogin({ email, password });
      setApiToken(response.data.key);
      changeRoute(ROUTES.swipe);
    } catch (e) {
      console.error(e);
      setError('Invalid email or/and password!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginForm}>
        <Text style={styles.logo}>Swilang</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.textInput}
          placeholder='E-mail'
          onChangeText={(value) => setEmail(value)}
          defaultValue={email}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          onChangeText={(value) => setPassword(value)}
          defaultValue={password}
          textContentType='password'
          autoCapitalize='none'
          autoCorrect={false}
        />
        <Button title='Login' onPress={handleLogin} />
      </View>
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginForm: {
    justifyContent: 'center',
    width: '80%',
    height: '50%',
  },
  logo: {
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LoginScreen;
