import { useEffect } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import PieChart from '../components/PieChart';
import { useAppStore } from '../stores/useAppStore';
import { Colors } from '../constants/colors';
import { apiGetUser } from '../api/api';
import { getApiToken } from '../utils/storage';

export default function StatsScreen() {
  const isFocused = useIsFocused();
  const userData = useAppStore((state) => state.userData);
  const setUserData = useAppStore((state) => state.setUserData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await apiGetUser({ token: await getApiToken() });
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const swipesData = [
    {
      name: 'Left',
      count: userData?.swipesLeft || 0,
      color: Colors.negativeColor,
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 16,
    },
    {
      name: 'Right',
      count: userData?.swipesRight || 0,
      color: Colors.positiveColor,
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 16,
    },
  ];

  const translationsKnowledgeData = [
    {
      name: 'Low',
      count: userData?.translationsKnowledge[1] || 0,
      color: Colors.bronzeColor,
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 16,
    },
    {
      name: 'Medium',
      count: userData?.translationsKnowledge[2] || 0,
      color: Colors.silverColor,
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 16,
    },
    {
      name: 'High',
      count: userData?.translationsKnowledge[3] || 0,
      color: Colors.goldColor,
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 16,
    },
  ];

  const translationsContributionsData = [
    {
      name: 'Translations',
      count: userData?.translationsAdded || 0,
      color: Colors.chartColors[0],
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 12,
    },
    {
      name: 'Words',
      count: userData?.wordsAdded || 0,
      color: Colors.chartColors[1],
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 12,
    },
    {
      name: 'Reports',
      count: userData?.reports || 0,
      color: Colors.chartColors[2],
      legendFontColor: Colors.primaryTextColor,
      legendFontSize: 12,
    },
  ];

  const charts = [
    {
      component: <PieChart data={swipesData} accessor='count' title='Swipes' />,
      id: 'swipes',
    },
    {
      component: (
        <PieChart
          data={translationsKnowledgeData}
          accessor='count'
          title='Words Knowledge'
          absolute
        />
      ),
      id: 'translationsKnowledge',
    },
    {
      component: (
        <PieChart
          data={translationsContributionsData}
          accessor='count'
          title='Contribution'
          absolute
        />
      ),
      id: 'translationsContributions',
    },
  ];

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: 20,
        marginBottom: 10,
      }}
    >
      {charts.map(({ component, id }) => (
        <View key={id}>{component}</View>
      ))}
    </View>
  );
}
