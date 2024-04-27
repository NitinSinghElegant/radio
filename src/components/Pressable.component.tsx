import React from 'react';
import {
  Pressable as PressableReactNative,
  PressableProps,
} from 'react-native';

const Pressable = (props: PressableProps) => {
  return (
    <PressableReactNative android_ripple={undefined} {...props}>
      {props.children}
    </PressableReactNative>
  );
};

export default Pressable;

