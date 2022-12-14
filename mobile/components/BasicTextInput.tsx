import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import React from 'react';
import { Colors } from '../constants/colors';

export default function BasicTextInput({ style, ...props }: TextInputProps) {
  return <TextInput style={[styles.textInput, style]} {...props} />;
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});
