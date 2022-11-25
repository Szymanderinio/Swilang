import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';

type Props = {
  text1: string;
  text2: string;
  setTranslationVisible: (x: boolean) => void;
};

const SwipeCard = ({ text1, text2, setTranslationVisible }: Props) => {
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setShowTranslation(false);
  }, [text1, text2]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowTranslation(true);
        setTranslationVisible(true);
      }}
    >
      <View style={styles.card}>
        <View style={styles.cardTranslation}>
          <Text style={styles.cardTranslationText}>{text1}</Text>
          {showTranslation ? (
            <>
              <Text style={styles.cardTranslationText}>{text2}</Text>
              <Text style={styles.hint}>swipe right if you were correct</Text>
              <Text style={styles.hint}>
                swipe left if you have to learn it yet
              </Text>
            </>
          ) : (
            <Text style={styles.hint}>Press to see translation</Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SwipeCard;

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
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});
