import { View, Text } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportTranslationScreen from '../screens/ReportTranslationScreen';
import SwipeScreen from '../screens/SwipeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import AuthRoute from './AuthRoute';

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
    default:
      const errorRoute: never = currentRoute;
      return (
        <View>
          <Text>404 Error - "{errorRoute}" doesn't exist</Text>
        </View>
      );
  }
};

export default Router;
