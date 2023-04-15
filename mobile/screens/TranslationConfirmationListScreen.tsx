import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';

import { NotConfirmedTranslation } from '../types/translations';
import { Colors } from '../constants/colors';
import { apiGetNotConfirmedTranslations } from '../api/api';
import BasicButton, { ButtonType } from '../components/BasicButton';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';

type ItemProps = {
  title: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
};

const TranslationConfirmationItemList = ({ title, onPress }: ItemProps) => (
  <Pressable onPress={onPress}>
    <View style={styles.translationConfirmationItem}>
      <Text style={styles.translationConfirmationItemTitle}>{title}</Text>
    </View>
  </Pressable>
);

export default function TranslationConfirmationListScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);
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
  }, []);

  const handleTranslationPress = (id: number) => {
    if (translations === null) {
      return;
    }

    const translation = translations.find((t) => t.id === id);

    if (translation === undefined) {
      return;
    }

    setNotConfirmedTranslation(translation);
    changeRoute(ROUTES.translationConfirmationReview);
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
                title={item.wordText}
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
            onPress={() => changeRoute(ROUTES.adminPanel)}
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
  translationConfirmationItemDate: {
    fontSize: 15,
    fontWeight: '600',
  },
});
