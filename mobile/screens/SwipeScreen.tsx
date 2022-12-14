import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { apiGetTranslations, apiSendActionTranslations } from '../api/api';
import BasicButton, { ButtonType } from '../components/BasicButton';

import SwipeCard from '../components/SwipeCard';
import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { TranslationAction } from '../types/swipes';
import { Translation } from '../types/translations';

export default function SwipeScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const setReportingTranslation = useAppStore(
    (state) => state.setReportingTranslation
  );
  const userData = useAppStore((state) => state.userData);
  const [translationVisible, setTranslationVisible] = useState(false);
  const [swipes, setSwipes] = useState<Translation[]>([]);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState<number>(0);

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
        containerStyle={styles.swiperContainer}
        marginTop={40}
        marginBottom={100}
        renderCard={(data) => {
          return (
            <SwipeCard
              text1={data?.wordText}
              text2={data?.translatedWord}
              setTranslationVisible={setTranslationVisible}
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
          setCurrentSwipeIndex(cardIndex + 1);
        }}
        infinite
        backgroundColor={'white'}
        showSecondCard
        stackSize={2}
        disableBottomSwipe
        disableTopSwipe
        disableRightSwipe={!translationVisible}
        disableLeftSwipe={!translationVisible}
      />
      <View style={styles.topBar}>
        <Text style={{ flex: 3, height: 30 }}>
          <Text style={styles.welcomeText}>Hi, </Text>
          <Text style={styles.welcomeUsername}>
            {userData?.firstName || userData?.email || 'user'}
          </Text>
          <Text style={styles.welcomeText}>!</Text>
        </Text>
        <TouchableWithoutFeedback
          onPress={() => changeRoute(ROUTES.userProfile)}
        >
          <Image
            source={require('../assets/images/user.png')}
            style={{ width: 30, height: 30 }}
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.bottomBar}>
        <BasicButton
          title='+ Add'
          style={styles.button}
          onPress={() => console.log('add')}
        />
        <BasicButton
          title='Report'
          type={ButtonType.report}
          style={styles.button}
          onPress={() => {
            setReportingTranslation(swipes[currentSwipeIndex]);

            changeRoute(ROUTES.reportTranslation);
          }}
        />
      </View>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
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
  topBar: {
    height: 150,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
  },
  welcomeUsername: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    height: 170,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 20,
  },
});
