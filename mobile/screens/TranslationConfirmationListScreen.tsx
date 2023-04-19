import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  Pressable,
  Text,
  View,
  Animated,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from 'react-native-gesture-handler';

import { NotConfirmedTranslation } from '../types/translations';
import { Colors } from '../constants/colors';
import {
  apiDeleteTranslation,
  apiGetNotConfirmedTranslations,
  apiPatchTranslation,
} from '../api/api';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { RootStackParamList } from '../navigators/RootNavigator';

type ItemProps = {
  word: string;
  translation: string;
  language: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  id: number;
  removeFromList: () => void;
};

const TranslationConfirmationItemList = ({
  word,
  language,
  translation,
  onPress,
  id,
  removeFromList,
}: ItemProps) => {
  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    onPress: () => void
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={onPress}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const handleAcceptTranslation = async () => {
    try {
      const response = await apiPatchTranslation({
        translationData: {
          isConfirmed: true,
        },
        translationID: id,
      });

      if (response.status === 200) {
        removeFromList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTranslation = async () => {
    try {
      const response = await apiDeleteTranslation({
        translationID: id,
      });

      if (response.status === 204) {
        removeFromList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 160,
        flexDirection: 'row',
      }}
    >
      {renderRightAction(
        'Accept',
        Colors.positiveColor,
        160,
        progress,
        handleAcceptTranslation
      )}
      {renderRightAction(
        'Remove',
        Colors.negativeColor,
        80,
        progress,
        handleDeleteTranslation
      )}
    </View>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={30}
        rightThreshold={40}
      >
        <Pressable onPress={onPress}>
          <View style={styles.translationConfirmationItem}>
            <Text style={styles.translationConfirmationItemTitle}>
              {word} - {translation}
            </Text>
            <Text style={styles.translationConfirmationItemLanguage}>
              {language}
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.translationConfirmationList
>;

export default function TranslationConfirmationListScreen({
  navigation,
}: Props) {
  const isFocused = useIsFocused();
  const setNotConfirmedTranslation = useAppStore(
    (state) => state.setNotConfirmedTranslation
  );

  const [translations, setTranslations] = useState<
    NotConfirmedTranslation[] | null
  >(null);

  useEffect(() => {
    const getNotConfirmedTranslations = async () => {
      try {
        const response = await apiGetNotConfirmedTranslations();
        setTranslations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getNotConfirmedTranslations();
  }, [isFocused]);

  const handleTranslationPress = (id: number) => {
    if (translations === null) {
      return;
    }

    const translation = translations.find((t) => t.id === id);

    if (translation === undefined) {
      return;
    }

    setNotConfirmedTranslation(translation);
    navigation.navigate(ROUTES.translationConfirmationReview);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {translations === null ? (
          <ActivityIndicator size='large' color={Colors.primaryColor} />
        ) : (
          <FlatList
            data={translations}
            renderItem={({ item }) => (
              <TranslationConfirmationItemList
                word={item.wordText}
                translation={item.translatedWord}
                language={item.languageText}
                id={item.id}
                onPress={() => handleTranslationPress(item.id)}
                removeFromList={() =>
                  setTranslations((state) =>
                    (state || []).filter((t) => t.id !== item.id)
                  )
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No not confirmed translations</Text>}
          />
        )}
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
    height: '95%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  translationConfirmationItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  translationConfirmationItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
  translationConfirmationItemLanguage: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionText: {
    color: Colors.secondaryTextColor,
    fontSize: 14,
    backgroundColor: 'transparent',
    padding: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
