import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import BasicButton, { ButtonType } from '../components/BasicButton';
import { useAppStore } from '../stores/useAppStore';
import { ROUTES } from '../types/routes';
import { Colors } from '../constants/colors';
import BasicTextInput from '../components/BasicTextInput';
import { apiGetLanguages, apiUpdateUser } from '../api/api';
import { asyncStorage } from '../stores/asyncStorage';
import { API_TOKEN_KEY } from '../constants/storageKeys';
import { Language } from '../types/translations';
import DropDownPicker from 'react-native-dropdown-picker';
import { getMainLanguage, setMainLanguage } from '../utils/storage';

export default function UserProfileScreen() {
  const changeRoute = useAppStore((state) => state.changeRoute);
  const setUserData = useAppStore((state) => state.setUserData);
  const userData = useAppStore((state) => state.userData);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [openLanguageDropdown, setOpenLanguageDropdown] = useState(false);

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const mainLanguage = await getMainLanguage();
        setSelectedLanguage(mainLanguage);
      } catch (error) {
        console.log(error);
      }

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
      const updateUserResponse = await apiUpdateUser({ firstName, lastName });
      setUserData(updateUserResponse.data);

      const mainLanguage = await getMainLanguage();
      if (selectedLanguage && selectedLanguage !== mainLanguage) {
        await setMainLanguage(selectedLanguage);
      }

      changeRoute(ROUTES.swipe);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    asyncStorage.storeData(null, API_TOKEN_KEY);
    changeRoute(ROUTES.login);
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
            title='Back'
            type={ButtonType.secondary}
            onPress={() => changeRoute(ROUTES.swipe)}
            style={styles.button}
          />
          <BasicButton
            title='Save'
            style={styles.button}
            onPress={saveUserProfile}
          />
        </View>
        <View style={[styles.buttons, { marginTop: 'auto' }]}>
          <BasicButton
            title='Logout'
            type={ButtonType.report}
            onPress={logout}
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
  dropdown: {
    padding: 10,
    marginBottom: 15,
    zIndex: 1000,
  },
});
