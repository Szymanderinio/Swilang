import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Props = {
  setIsLogin: (value: boolean) => void;
};

const LoginScreen = ({ setIsLogin }: Props) => {
  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <TextInput />
      <TextInput />
      <Button title='Login' onPress={() => setIsLogin(true)} />
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
  },
});

export default LoginScreen;
