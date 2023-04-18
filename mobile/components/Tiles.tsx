import { View, StyleSheet } from 'react-native';

import Tile from './Tile';

export type TileItem = {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  visible?: boolean;
};

type Props = {
  items: TileItem[];
};

export default function Tiles({ items }: Props) {
  return (
    <View style={[styles.container]}>
      {items
        .filter(({ visible }) => visible)
        .map(({ title, icon, onPress }) => (
          <Tile key={title} title={title} icon={icon} onPress={onPress} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
