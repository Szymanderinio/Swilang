import { Platform, View, StyleSheet } from 'react-native';
import DropDownPicker, {
  DropDownPickerProps,
  ValueType,
} from 'react-native-dropdown-picker';
import { Colors } from '../constants/colors';

export default function Dropdown<T extends ValueType>({
  ...props
}: DropDownPickerProps<T>) {
  return (
    <View style={Platform.OS !== 'android' ? { zIndex: 1 } : null}>
      <DropDownPicker
        style={styles.dropdown}
        dropDownContainerStyle={styles.container}
        itemSeparator
        itemSeparatorStyle={styles.itemSeparator}
        placeholderStyle={styles.placeholder}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    padding: 10,
    marginBottom: 15,
    zIndex: 1000,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  container: {
    borderColor: Colors.primaryColor,
  },
  itemSeparator: {
    backgroundColor: Colors.primaryColor,
    width: '95%',
    alignSelf: 'center',
  },
  placeholder: {
    color: Colors.placeholderTextColor,
  },
});
