import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

import { Colors } from '../constants/colors';

type Props = {
  text1: string;
  text2: string;
  id: number;
  setVisibleTranslationsIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const SwipeCard = ({ text1, text2, id, setVisibleTranslationsIds }: Props) => {
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setShowTranslation(false);
  }, [text1, text2]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowTranslation(true);
        setVisibleTranslationsIds((prev) => [...prev, id]);
      }}
    >
      <View style={styles.card}>
        <View style={styles.insideCard}>
          <View style={styles.idContainer}>
            <Text style={styles.id}>{id}</Text>
          </View>
          <View style={styles.cardTranslation}>
            <View style={styles.cardTranslationContainer}>
              <Text style={[styles.cardTranslationText, styles.originalWord]}>
                {text1}
              </Text>
            </View>
            <View style={styles.cardTranslationContainer}>
              <Text style={[styles.cardTranslationText, styles.translatedWord]}>
                {showTranslation ? text2 : ''}
              </Text>
            </View>

            <View style={styles.spacer}></View>

            <View style={styles.bottomHint}>
              {showTranslation ? (
                <View style={styles.splitHint}>
                  <View
                    style={[
                      styles.splitBox,
                      { backgroundColor: Colors.negativeColor },
                    ]}
                  >
                    <AntDesign name='arrowleft' size={30} color='black' />
                    <Text style={styles.hintText}>wrong</Text>
                  </View>
                  <View
                    style={[
                      styles.splitBox,
                      { backgroundColor: Colors.positiveColor },
                    ]}
                  >
                    <AntDesign name='arrowright' size={30} color='black' />
                    <Text style={styles.hintText}>good</Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.hintText}>tap to reveal</Text>
              )}
            </View>
          </View>
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
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  insideCard: {
    display: 'flex',
    flex: 1,
    margin: 20,
    backgroundColor: Colors.secondaryBackgroundColor,
    paddingBottom: 50,
    justifyContent: 'flex-start',
  },
  idContainer: {
    height: 50,
    width: 50,
    backgroundColor: Colors.primaryColor,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  id: {
    color: Colors.secondaryBackgroundColor,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 50,
    height: 50,
  },
  cardTranslation: {
    display: 'flex',
    height: '100%',
  },
  cardTranslationContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  cardTranslationText: {
    fontSize: 40,
    textAlign: 'center',
  },
  originalWord: {
    fontWeight: '700',
    color: Colors.primaryColor,
  },
  translatedWord: {
    fontWeight: '300',
    fontSize: 35,
    color: Colors.primaryTextColor,
  },
  spacer: {
    marginVertical: 10,
    alignSelf: 'center',
    height: 0,
    width: '95%',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderStyle: 'dashed',
  },
  hintText: {
    fontSize: 22,
    textAlign: 'center',
    color: Colors.primaryTextColor,
  },
  bottomHint: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
  },
  splitHint: {
    display: 'flex',
    flexDirection: 'row',
  },
  splitBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    aspectRatio: 1 / 1,
    margin: 10,
  },
});
