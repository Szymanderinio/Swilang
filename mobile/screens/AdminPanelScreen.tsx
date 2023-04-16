import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigators/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.adminPanel
>;

export default function AdminPanelScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Admin Panel</Text>
        <View>
          <BasicButton
            title='Report list'
            type={ButtonType.info}
            onPress={() => navigation.navigate(ROUTES.reportList)}
            style={styles.button}
          />
          <BasicButton
            title='Add translation'
            type={ButtonType.info}
            onPress={() => navigation.navigate(ROUTES.addTranslation)}
            style={styles.button}
          />
          <BasicButton
            title='Not confirmed translations list'
            type={ButtonType.info}
            onPress={() =>
              navigation.navigate(ROUTES.translationConfirmationList)
            }
            style={styles.button}
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => navigation.navigate(ROUTES.swipe)}
            style={styles.button}
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
  reportItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  reportItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
});
