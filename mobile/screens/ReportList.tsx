import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import { apiGetReports } from '../api/api';
import { Report } from '../types/reports';
import { useAppStore } from '../stores/useAppStore';
import { ReportTypeMap } from '../types/swipes';
import { RootStackParamList } from '../navigators/RootNavigator';

type ItemProps = {
  title: string;
  date: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
};

const ReportItemList = ({ title, date, onPress }: ItemProps) => (
  <Pressable onPress={onPress}>
    <View style={styles.reportItem}>
      <Text style={styles.reportItemTitle}>{title}</Text>
      <Text style={styles.reportItemDate}>{date}</Text>
    </View>
  </Pressable>
);

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.reportList
>;

export default function ReportListScreen({ navigation }: Props) {
  const setReportReviewData = useAppStore((state) => state.setReportReviewData);
  const [reports, setReports] = React.useState<Report[] | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiGetReports();
        const unsolvedReports = response.data.filter(
          (report) => !report.isSolved
        );
        setReports(unsolvedReports);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReports();
  }, [isFocused]);

  const handleReportPress = (id: number) => {
    if (reports === null) {
      return;
    }

    setReportReviewData(reports.find((report) => report.id === id) ?? null);
    navigation.navigate(ROUTES.reportReview);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Report list</Text>
        {reports === null ? (
          <ActivityIndicator size='large' color={Colors.primaryColor} />
        ) : (
          <FlatList
            data={reports}
            renderItem={({ item }) => (
              <ReportItemList
                title={ReportTypeMap[item.reportType] || '-'}
                date={new Date(item.createdAt).toLocaleString()}
                onPress={() => handleReportPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No reports</Text>}
          />
        )}

        <View style={styles.buttons}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => navigation.navigate(ROUTES.adminPanel)}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  box: {
    width: '90%',
    height: '80%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.primaryColor,
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 10,
  },
  reportItem: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  reportItemTitle: {
    fontSize: 20,
    color: Colors.primaryTextColor,
  },
  reportItemDate: {
    fontSize: 15,
    fontWeight: '600',
  },
});
