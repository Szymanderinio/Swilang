import { View, Text, StyleSheet } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportTranslationScreen from '../screens/ReportTranslationScreen';
import SwipeScreen from '../screens/SwipeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import AuthRoute from './AuthRoute';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import ReportListScreen from '../screens/ReportList';
import ReportReviewScreen from '../screens/ReportReview';
import AddTranslationScreen from '../screens/AddTranslationScreen';
import TranslationConfirmationListScreen from '../screens/TranslationConfirmationListScreen';
import TranslationConfirmationReviewScreen from '../screens/TranslationsConfirmationReviewScreen';

const Router = () => {
  const currentRoute = useAppStore((state) => state.currentRoute);

  switch (currentRoute) {
    case ROUTES.login:
      return <LoginScreen />;
    case ROUTES.register:
      return <RegisterScreen />;
    case ROUTES.swipe:
      return (
        <AuthRoute>
          <SwipeScreen />
        </AuthRoute>
      );
    case ROUTES.reportTranslation:
      return (
        <AuthRoute>
          <ReportTranslationScreen />
        </AuthRoute>
      );
    case ROUTES.userProfile:
      return (
        <AuthRoute>
          <UserProfileScreen />
        </AuthRoute>
      );
    case ROUTES.adminPanel:
      return (
        <AuthRoute>
          <AdminPanelScreen />
        </AuthRoute>
      );
    case ROUTES.reportList:
      return (
        <AuthRoute>
          <ReportListScreen />
        </AuthRoute>
      );
    case ROUTES.reportReview:
      return (
        <AuthRoute>
          <ReportReviewScreen />
        </AuthRoute>
      );
    case ROUTES.addTranslation:
      return (
        <AuthRoute>
          <AddTranslationScreen />
        </AuthRoute>
      );
    case ROUTES.translationConfirmationList:
      return (
        <AuthRoute>
          <TranslationConfirmationListScreen />
        </AuthRoute>
      );
    case ROUTES.translationConfirmationReview:
      return (
        <AuthRoute>
          <TranslationConfirmationReviewScreen />
        </AuthRoute>
      );
    default:
      const errorRoute: never = currentRoute;
      return (
        <View style={styles.container}>
          <Text>404 Error - Route "{errorRoute}" doesn't exist</Text>
        </View>
      );
  }
};

export default Router;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
