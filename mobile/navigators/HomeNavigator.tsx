import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';

import { ROUTES, Route } from '../types/routes';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import StatsScreen from '../screens/StatsScreen';
import SwipeScreen from '../screens/SwipeScreen';
import { useAppStore } from '../stores/useAppStore';
import UserProfileScreen from '../screens/UserProfileScreen';
import { baseScreenOptions } from './RootNavigator';
import { Platform } from 'react-native';

export type BottomTabParamList = Record<Route, undefined>;

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function HomeNavigator() {
  const userData = useAppStore((state) => state.userData);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80 + (Platform.OS === 'ios' ? 0 : -10),
        },
        tabBarLabelStyle: {
          marginBottom: Platform.OS === 'ios' ? 0 : 12,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.swipe}
        component={SwipeScreen}
        options={{
          tabBarLabel: 'Swipe',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='gesture-swipe'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.stats}
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='stats-chart' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.adminPanel}
        component={AdminPanelScreen}
        options={{
          ...baseScreenOptions,
          headerTitle: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='hammer-screwdriver'
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name={ROUTES.userProfile}
        component={UserProfileScreen}
        options={{
          ...baseScreenOptions,
          headerTitle: 'Your Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='person' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
