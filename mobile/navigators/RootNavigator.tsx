import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES, Route } from '../types/routes';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportTranslationScreen from '../screens/ReportTranslationScreen';
import SwipeScreen from '../screens/SwipeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import ReportListScreen from '../screens/ReportList';
import ReportReviewScreen from '../screens/ReportReview';
import AddTranslationScreen from '../screens/AddTranslationScreen';
import TranslationConfirmationListScreen from '../screens/TranslationConfirmationListScreen';
import TranslationConfirmationReviewScreen from '../screens/TranslationsConfirmationReviewScreen';
import EditTranslationScreen from '../screens/EditTranslationScreen';
import { useAppStore } from '../stores/useAppStore';
import { getApiToken } from '../utils/storage';
import HomeNavigator from './HomeNavigator';

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
          />
          <RootStack.Screen
            name={ROUTES.userProfile}
            component={UserProfileScreen}
          />
          <RootStack.Screen
            name={ROUTES.reportList}
            component={ReportListScreen}
          />
          <RootStack.Screen
            name={ROUTES.reportReview}
            component={ReportReviewScreen}
          />
          <RootStack.Screen
            name={ROUTES.addTranslation}
            component={AddTranslationScreen}
          />
          <RootStack.Screen
            name={ROUTES.translationConfirmationList}
            component={TranslationConfirmationListScreen}
          />
          <RootStack.Screen
            name={ROUTES.translationConfirmationReview}
            component={TranslationConfirmationReviewScreen}
          />
          <RootStack.Screen
            name={ROUTES.editTranslation}
            component={EditTranslationScreen}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}
