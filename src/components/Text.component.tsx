import React from 'react';
import { StyleSheet, Text as TextReactNative, TextProps } from 'react-native';

import { Fonts } from '../styles/fonts.style';

const Text = (props: TextProps) => {
  const styles = StyleSheet.create({
    text: {
      fontSize: 12,
      color: '#121212',
      textAlign: 'center',
      fontFamily: Fonts.Tajawal_400Regular,
    },
  });

  return (
    <TextReactNative
      style={[styles.text, props.style]}
      allowFontScaling={false}
    >
      {props.children}
    </TextReactNative>
  );
};

export default Text;

