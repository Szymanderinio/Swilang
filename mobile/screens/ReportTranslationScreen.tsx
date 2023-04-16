import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { apiSendReportTranslations } from '../api/api';
import { ReportType } from '../types/swipes';
import { RootStackParamList } from '../navigators/RootNavigator';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.reportTranslation
>;

export default function ReportTranslationScreen({ navigation }: Props) {
  const reportingTranslation = useAppStore(
    (state) => state.reportingTranslation
  );

  const [open, setOpen] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [reportType, setReportType] = useState<
    typeof ReportType[keyof typeof ReportType] | null
  >(null);

  if (!reportingTranslation) {
    navigation.navigate(ROUTES.swipe);

    return null;
  }

  const dropdownOptions = [
    { label: 'Bad Translation', value: ReportType.BAD_TRANSLATION },
    { label: 'Offensive Word', value: ReportType.OFFENSIVE_WORD },
    { label: 'Other (comment below)', value: ReportType.OTHER },
  ];

  const reportTranslation = async () => {
    if (reportType === null) return;

    try {
      await apiSendReportTranslations({
        reportType,
        translationID: reportingTranslation.id,
        comment: reasonText || undefined,
      });
      navigation.navigate(ROUTES.swipe);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Report Translation</Text>
        <Text style={styles.textInfo}>
          Original word:&nbsp;
          <Text style={{ fontWeight: 'bold' }}>
            {reportingTranslation?.wordText}
          </Text>
        </Text>
        <Text style={styles.textInfo}>
          Translation:&nbsp;
          <Text style={{ fontWeight: 'bold' }}>
            {reportingTranslation?.translatedWord}
          </Text>
        </Text>
        <Text style={styles.textInfo}>
          Language:&nbsp;
          <Text style={{ fontWeight: 'bold' }}>
            {reportingTranslation?.languageText}
          </Text>
        </Text>
        <Text style={styles.reasonInfo}>Reason:</Text>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          items={dropdownOptions}
          value={reportType}
          setValue={setReportType}
        />

        {reportType === ReportType.OTHER && (
          <>
            <Text style={styles.reasonInfo}>Comment:</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setReasonText(text)}
              value={reasonText}
              style={styles.reasonTextarea}
            />
          </>
        )}
        <View style={styles.buttons}>
          <BasicButton
            title='Cancel'
            type={ButtonType.secondary}
            style={styles.button}
            onPress={() => {
              navigation.navigate(ROUTES.swipe);
            }}
          />
          <BasicButton
            title='Report'
            type={ButtonType.report}
            style={styles.button}
            onPress={reportTranslation}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  box: {
    width: '90%',
    height: '60%',
  },
  title: {
    color: Colors.primaryColor,
    fontSize: 30,
    fontWeight: '600',
  },
  textInfo: {
    marginVertical: 5,
  },
  reasonInfo: {
    marginTop: 20,
    marginBottom: 5,
  },
  reasonTextarea: {
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    height: 100,
  },
  buttons: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 20,
  },
});
