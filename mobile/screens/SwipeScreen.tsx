import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { apiGetTranslations, apiSendActionTranslations } from '../api/api';

import SwipeCard from '../components/SwipeCard';
import { TranslationAction } from '../types/swipes';
import { Translation } from '../types/translations';

export default function SwipeScreen() {
  const [translationVisible, setTranslationVisible] = useState(false);
  const [swipes, setSwipes] = useState<Translation[]>([]);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await apiGetTranslations();
        setSwipes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTranslations();
  }, []);

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
    setTranslationVisible(false);
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={swipes}
        renderCard={(data) => (
          <SwipeCard
            text1={data?.wordText}
            text2={data?.translatedWord}
            setTranslationVisible={setTranslationVisible}
          />
        )}
        onSwipedLeft={(index) =>
          handleSwiped(index, TranslationAction.SWIPE_LEFT)
        }
        onSwipedRight={(index) =>
          handleSwiped(index, TranslationAction.SWIPE_RIGHT)
        }
        infinite
        backgroundColor={'white'}
        stackSize={2}
        disableBottomSwipe
        disableTopSwipe
        disableRightSwipe={!translationVisible}
        disableLeftSwipe={!translationVisible}
      />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    display: 'flex',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cardTranslation: {},
  cardTranslationText: {
    fontSize: 30,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});
