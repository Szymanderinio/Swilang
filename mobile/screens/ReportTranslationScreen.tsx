import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Colors } from '../constants/colors';
import { useAppStore } from '../stores/useAppStore';
import BasicButton, { ButtonType } from '../components/BasicButton';
import { ROUTES } from '../types/routes';
import { apiSendReportTranslations } from '../api/api';
import { ReportType } from '../types/swipes';
import { RootStackParamList } from '../navigators/RootNavigator';
import Dropdown from '../components/Dropdown';

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
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(true);
      await apiSendReportTranslations({
        reportType,
        translationID: reportingTranslation.id,
        comment: reasonText || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.box}>
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
          <Dropdown
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
                placeholder='Enter your comment here'
              />
            </>
          )}
          <View style={styles.buttons}>
            <BasicButton
              title='Send'
              type={ButtonType.report}
              style={styles.button}
              onPress={reportTranslation}
              disabled={isSaving}
              isLoading={isSaving}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    height: '80%',
  },
  textInfo: {
    fontSize: 22,
    marginVertical: 5,
  },
  reasonInfo: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 22,
  },
  reasonTextarea: {
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 100,
    backgroundColor: Colors.primaryBackgroundColor,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
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
