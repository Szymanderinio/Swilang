import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES, Route } from '../types/routes';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import StatsScreen from '../screens/StatsScreen';
import SwipeScreen from '../screens/SwipeScreen';
import { useAppStore } from '../stores/useAppStore';

export type BottomTabParamList = Record<Route, undefined>;

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function HomeNavigator() {
  const userData = useAppStore((state) => state.userData);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
      {userData?.isStaff && (
        <Tab.Screen
          name={ROUTES.adminPanel}
          component={AdminPanelScreen}
          options={{
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='hammer-screwdriver'
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}
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
    </Tab.Navigator>
  );
}