import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { NotConfirmedTranslation } from '../types/translations';
import { Colors } from '../constants/colors';
import { apiGetNotConfirmedTranslations } from '../api/api';
import BasicButton, { ButtonType } from '../components/BasicButton';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { RootStackParamList } from '../navigators/RootNavigator';

type ItemProps = {
  word: string;
  translation: string;
  language: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
};

const TranslationConfirmationItemList = ({
  word,
  language,
  translation,
  onPress,
}: ItemProps) => (
  <Pressable onPress={onPress}>
    <View style={styles.translationConfirmationItem}>
      <Text style={styles.translationConfirmationItemTitle}>
        {word} - {translation}
      </Text>
      <Text style={styles.translationConfirmationItemLanguage}>{language}</Text>
    </View>
  </Pressable>
);

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
        <Text style={styles.title}>Not confirmed translations list</Text>
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
                onPress={() => handleTranslationPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No not confirmed translations</Text>}
          />
        )}

        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => navigation.navigate(ROUTES.adminPanel)}
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
});
