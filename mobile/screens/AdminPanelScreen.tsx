import { StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import { ROUTES } from '../types/routes';
import { RootStackParamList } from '../navigators/RootNavigator';
import Tiles, { TileItem } from '../components/Tiles';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';

type Props = BottomTabScreenProps<RootStackParamList, typeof ROUTES.adminPanel>;

export default function AdminPanelScreen({ navigation }: Props) {
  const userData = useAppStore((state) => state.userData);

  const tiles: TileItem[] = [
    {
      title: 'Report list',
      icon: (
        <MaterialIcons name='report' size={36} color={Colors.primaryColor} />
      ),
      onPress: () => navigation.navigate(ROUTES.reportList),
      visible: userData?.isStaff,
    },
    {
      title: 'Add translation',
      icon: (
        <AntDesign name='pluscircleo' size={30} color={Colors.primaryColor} />
      ),
      onPress: () => navigation.navigate(ROUTES.addTranslation),
      visible: true,
    },
    {
      title: 'Not confirmed translations list',
      icon: (
        <MaterialIcons
          name='playlist-add-check'
          size={30}
          color={Colors.primaryColor}
        />
      ),
      onPress: () => navigation.navigate(ROUTES.translationConfirmationList),
      visible: userData?.isStaff,
    },
  ];

  return (
    <View style={styles.container}>
      <Tiles items={tiles} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
