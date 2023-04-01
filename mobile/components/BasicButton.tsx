import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/colors';

export const ButtonType = {
  info: 'info',
  report: 'report',
  accept: 'accept',
  secondary: 'secondary',
} as const;

type Props = {
  title: string;
  type?: typeof ButtonType[keyof typeof ButtonType];
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  isLoading?: boolean;
};

export default function BasicButton({
  title,
  type = ButtonType.info,
  style: containerStyle,
  onPress,
  isLoading = false,
}: Props) {
  let buttonTypeStyles;
  let buttonTypeContainerStyles;
  switch (type) {
    case ButtonType.info:
      buttonTypeStyles = styles.buttonInfo;
      buttonTypeContainerStyles = styles.buttonContainerInfo;
      break;
    case ButtonType.report:
      buttonTypeStyles = styles.buttonReport;
      buttonTypeContainerStyles = styles.buttonContainerReport;
      break;
    case ButtonType.accept:
      buttonTypeStyles = styles.buttonAccept;
      buttonTypeContainerStyles = styles.buttonContainerAccept;
      break;
    case ButtonType.secondary:
      buttonTypeStyles = styles.buttonSecondary;
      buttonTypeContainerStyles = styles.buttonContainerSecondary;
      break;
    default:
      buttonTypeStyles = null;
      buttonTypeContainerStyles = null;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[styles.container, buttonTypeContainerStyles, containerStyle]}
      >
        {isLoading && <ActivityIndicator style={styles.loading} />}
        <Text style={[styles.text, buttonTypeStyles]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 22,
  },
  buttonInfo: {
    color: Colors.secondaryTextColor,
  },
  buttonReport: {
    color: Colors.negativeColor,
  },
  buttonAccept: {
    color: Colors.positiveColor,
  },
  buttonSecondary: {
    color: Colors.primaryColor,
  },
  buttonContainerInfo: {
    backgroundColor: Colors.primaryColor,
  },
  buttonContainerReport: {
    borderColor: Colors.negativeColor,
    borderWidth: 2,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  buttonContainerAccept: {
    borderColor: Colors.positiveColor,
    borderWidth: 2,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  buttonContainerSecondary: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  loading: {
    marginRight: 10,
  },
});
