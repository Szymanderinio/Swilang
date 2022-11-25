import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import SwipeCard from '../components/SwipeCard';

const SWIPES = [
  {
    text1: 'chleb',
    text2: 'bread',
  },
  {
    text1: 'kawa',
    text2: 'coffee',
  },
  {
    text1: 'niebo',
    text2: 'sky',
  },
  {
    text1: 'słońce',
    text2: 'sun',
  },
];

export default function SwipeScreen() {
  const [translationVisible, setTranslationVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Swiper
        cards={SWIPES}
        renderCard={({ text1, text2 }) => (
          <SwipeCard
            text1={text1}
            text2={text2}
            setTranslationVisible={setTranslationVisible}
          />
        )}
        onSwiped={(cardIndex) => {
          console.log(cardIndex);
          setTranslationVisible(false);
          console.log('setTranslationVisible', setTranslationVisible);
        }}
        onSwipedAll={() => {
          console.log('onSwipedAll');
        }}
        infinite
        backgroundColor={'white'}
        stackSize={SWIPES.length}
        disableBottomSwipe={!translationVisible}
        disableTopSwipe={!translationVisible}
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
