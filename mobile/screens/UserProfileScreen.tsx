import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import BasicTextInput from '../components/BasicTextInput';
import {
  ApiUpdateUserRequest,
  apiGetLanguages,
  apiUpdateUser,
} from '../api/api';
import { Language } from '../types/translations';
import DropDownPicker from 'react-native-dropdown-picker';
import { removeApiToken } from '../utils/storage';
import { RootStackParamList } from '../components/Router';

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.userProfile
>;

export default function UserProfileScreen({ navigation }: Props) {
  const setUserData = useAppStore((state) => state.setUserData);
  const userData = useAppStore((state) => state.userData);
  const setMainLanguage = useAppStore((state) => state.setMainLanguage);
  const mainLanguage = useAppStore((state) => state.mainLanguage);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    mainLanguage
  );
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const response = await apiGetLanguages();
        if (response.status === 200) {
          setLanguages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLanguages();
  }, []);

  useEffect(() => {
    if (userData?.firstName) {
      setFirstName(userData?.firstName);
    }
    if (userData?.lastName) {
      setLastName(userData?.lastName);
    }
  }, [userData]);

  const saveUserProfile = async () => {
    try {
      const selectedLanguageId = languages.find(
        (language) => language.languageShort === selectedLanguage
      )?.id;
      const payload: ApiUpdateUserRequest = {
        firstName,
        lastName,
      };
      if (selectedLanguageId != undefined) {
        payload.currentLanguage = selectedLanguageId;
      }
      const updateUserResponse = await apiUpdateUser(payload);
      setUserData(updateUserResponse.data);

      setMainLanguage(selectedLanguage);

      navigation.navigate(ROUTES.swipe);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    removeApiToken();
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Your Profile</Text>
        <View>
          <BasicTextInput
            autoCapitalize='words'
            autoCorrect={false}
            placeholder='First name'
            onChangeText={setFirstName}
            defaultValue={firstName}
          />
          <BasicTextInput
            autoCapitalize='words'
            autoCorrect={false}
            placeholder='Last name'
            onChangeText={setLastName}
            defaultValue={lastName}
          />
        </View>
        <View style={Platform.OS !== 'android' ? { zIndex: 1 } : null}>
          <DropDownPicker
            items={languages.map(({ language, languageShort }) => ({
              label: language,
              value: languageShort,
            }))}
            multiple={false}
            value={selectedLanguage}
            setValue={setSelectedLanguage}
            setOpen={setOpenLanguageDropdown}
            open={openLanguageDropdown}
            style={styles.dropdown}
            placeholder='Select language'
          />
        </View>
        <View style={styles.buttons}>
          <BasicButton
            title='Logout'
            type={ButtonType.report}
            onPress={logout}
            style={styles.button}
          />
        </View>
        <View style={[styles.buttons, { marginTop: 'auto' }]}>
          <BasicButton
            title='Back'
            type={ButtonType.secondary}
            onPress={() => navigation.navigate(ROUTES.swipe)}
            style={styles.button}
          />
          <BasicButton
            title='Save'
            style={styles.button}
            onPress={saveUserProfile}
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
  dropdown: {
    padding: 10,
    marginBottom: 15,
    zIndex: 1000,
  },
});
