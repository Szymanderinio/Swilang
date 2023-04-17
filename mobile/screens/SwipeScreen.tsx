import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

import { apiGetTranslations, apiSendActionTranslations } from '../api/api';
import BasicButton, { ButtonType } from '../components/BasicButton';
import SwipeCard from '../components/SwipeCard';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { TranslationAction } from '../types/swipes';
import { Translation } from '../types/translations';
import { RootStackParamList } from '../navigators/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, typeof ROUTES.swipe>;

export default function SwipeScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const setReportingTranslation = useAppStore(
    (state) => state.setReportingTranslation
  );
  const mainLanguage = useAppStore((state) => state.mainLanguage);

  const [visibleTranslationIds, setVisibleTranslationsIds] = useState<number[]>(
    []
  );
  const [swipes, setSwipes] = useState<Translation[]>([]);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        const payload = mainLanguage ? { language: mainLanguage } : {};
        const response = await apiGetTranslations(payload);
        setSwipes(response.data);
        setCurrentSwipeIndex(0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [isFocused]);

  const handleSwiped = async (
    cardIndex: number,
    actionType: typeof TranslationAction[keyof typeof TranslationAction]
  ) => {
    try {
      await apiSendActionTranslations({
        actionType,
        translationID: swipes[cardIndex].id,
      });
    } catch (error) {
      console.error(error);
    }
    setVisibleTranslationsIds((prev) => {
      return prev.filter((id) => id !== swipes[cardIndex].id);
    });
  };

  return (
    <View style={styles.container}>
      {!isLoading ? (
        <Swiper
          cards={swipes}
          containerStyle={styles.swiperContainer}
          marginTop={30}
          marginBottom={120}
          renderCard={(data) => {
            return (
              <SwipeCard
                text1={data?.wordText}
                text2={data?.translatedWord}
                id={data?.id}
                setVisibleTranslationsIds={setVisibleTranslationsIds}
              />
            );
          }}
          onSwipedLeft={(index) =>
            handleSwiped(index, TranslationAction.SWIPE_LEFT)
          }
          onSwipedRight={(index) =>
            handleSwiped(index, TranslationAction.SWIPE_RIGHT)
          }
          onSwiped={(cardIndex) => {
            setCurrentSwipeIndex((cardIndex + 1) % swipes.length);
          }}
          infinite
          cardIndex={currentSwipeIndex}
          backgroundColor={'white'}
          showSecondCard
          stackSize={2}
          disableBottomSwipe
          disableTopSwipe
          disableRightSwipe={
            !visibleTranslationIds.includes(swipes[currentSwipeIndex]?.id)
          }
          disableLeftSwipe={
            !visibleTranslationIds.includes(swipes[currentSwipeIndex]?.id)
          }
        />
      ) : null}
      {isLoading ? (
        <View style={styles.fullScreen}>
          <ActivityIndicator />
        </View>
      ) : null}
      <View style={styles.bottomBar}>
        <BasicButton
          title='Report'
          type={ButtonType.report}
          style={styles.button}
          onPress={() => {
            setReportingTranslation(swipes[currentSwipeIndex]);

            navigation.navigate(ROUTES.reportTranslation);
          }}
        />
      </View>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    display: 'flex',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  swiperContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundColor,
  },
  cardTranslationText: {
    fontSize: 30,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 20,
  },
  welcomeUsername: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    marginTop: 'auto',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 20,
  },
});
