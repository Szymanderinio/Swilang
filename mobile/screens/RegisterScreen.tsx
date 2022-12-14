import React, { useState } from 'react';

import { View, Text, StatusBar, StyleSheet, Button } from 'react-native';
import { apiRegister } from '../api/api';
import BasicTextInput from '../components/BasicTextInput';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';

const RegisterScreen = () => {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (useAppStore.getState().apiToken) {
    changeRoute(ROUTES.swipe);

    return null;
  }

  const handleRegister = async () => {
    setError('');
    if (email.length === 0 || password.length === 0) {
      setError('You have to fill all fields!');
      return;
    }

    try {
      await apiRegister({ email, password });
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
    backgroundColor: '#F5FCFF',
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
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
  },
});

export default RegisterScreen;
