import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { TileItem } from './Tiles';
import { Colors } from '../constants/colors';

export default function Tile({ title, icon, onPress }: TileItem) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: Colors.primaryBackgroundColor,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    color: Colors.primaryTextColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
});
