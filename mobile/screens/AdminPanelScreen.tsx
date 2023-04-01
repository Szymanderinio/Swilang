import { StyleSheet, Text, View } from 'react-native';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';

export default function AdminPanelScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Admin Panel</Text>
        <View>
          <BasicButton
            title='Report list'
            type={ButtonType.secondary}
            onPress={() => changeRoute(ROUTES.reportList)}
            style={styles.button}
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => changeRoute(ROUTES.swipe)}
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
