import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

import { ROUTES, Route } from '../types/routes';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportTranslationScreen from '../screens/ReportTranslationScreen';
import SwipeScreen from '../screens/SwipeScreen';
import ReportListScreen from '../screens/ReportList';
import ReportReviewScreen from '../screens/ReportReview';
import AddTranslationScreen from '../screens/AddTranslationScreen';
import TranslationConfirmationListScreen from '../screens/TranslationConfirmationListScreen';
import TranslationConfirmationReviewScreen from '../screens/TranslationsConfirmationReviewScreen';
import EditTranslationScreen from '../screens/EditTranslationScreen';
import { useAppStore } from '../stores/useAppStore';
import { getApiToken } from '../utils/storage';
import HomeNavigator from './HomeNavigator';
import { Colors } from '../constants/colors';

export type RootStackParamList = Record<Route, undefined>;

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const setLoggedIn = useAppStore((state) => state.setLoggedIn);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const apiToken = await getApiToken();

        if (apiToken) {
          setLoggedIn(true);
        }
      } catch (e) {
        console.error(e);
      }
    };

    checkIfLoggedIn();
  }, []);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn && (
        <>
          <RootStack.Screen name={ROUTES.login} component={LoginScreen} />
          <RootStack.Screen name={ROUTES.register} component={RegisterScreen} />
        </>
      )}

      {!!isLoggedIn && (
        <>
          <RootStack.Screen name={ROUTES.home} component={HomeNavigator} />
          <RootStack.Screen name={ROUTES.swipe} component={SwipeScreen} />
          <RootStack.Screen
            name={ROUTES.reportTranslation}
            component={ReportTranslationScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Report Translation',
            }}
          />
          <RootStack.Screen
            name={ROUTES.reportList}
            component={ReportListScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Report List',
            }}
          />
          <RootStack.Screen
            name={ROUTES.reportReview}
            component={ReportReviewScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Report Review',
            }}
          />
          <RootStack.Screen
            name={ROUTES.addTranslation}
            component={AddTranslationScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Add translation',
            }}
          />
          <RootStack.Screen
            name={ROUTES.translationConfirmationList}
            component={TranslationConfirmationListScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Not confirmed translations list',
            }}
          />
          <RootStack.Screen
            name={ROUTES.translationConfirmationReview}
            component={TranslationConfirmationReviewScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Translation Confirmation',
            }}
          />
          <RootStack.Screen
            name={ROUTES.editTranslation}
            component={EditTranslationScreen}
            options={{
              ...baseScreenOptions,
              headerTitle: 'Edit translation',
            }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.primaryColor,
    fontSize: 22,
    fontWeight: '600',
  },
});

export const baseScreenOptions = {
  headerShown: true,
  headerBackButtonMenuEnabled: true,
  headerBackTitleVisible: false,
  headerTitleStyle: styles.title,
};
