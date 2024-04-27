import React from 'react';
import { BackHandler, StyleSheet, View, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import WebView from 'react-native-webview';

import { RootStackParamList } from '../routes/types.route';
import Pressable from '../components/Pressable.component';
import { language } from '../languages';
import Text from '../components/Text.component';
import { Fonts } from '../styles/fonts.style';

type NewsNavigationProp = StackNavigationProp<RootStackParamList, 'News'>;
type NewsRouteProp = RouteProp<RootStackParamList, 'News'>;
type NewsProps = {
  navigation: NewsNavigationProp;
  route: NewsRouteProp;
};

export default function NewsScreen({ navigation, route }: NewsProps) {
  const { newsUrl } = route.params;
  const { news } = language;

  const handleBackButton = () => {
    navigation.goBack();
    return true; // OVERRIDE BACK BUTTON EVENTO PADRAO
  };

  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton
    );
    return () => subscription.remove();
  });

  const onPressBackAction = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2A954F',
    },
    gradientContainer: {
      position: 'absolute',
      height: '100%',
      flex: 1,
      width: '100%',
    },
    gradient: {
      flex: 1,
      height: '110%',
    },
    backIconContainer: {
      position: 'absolute',
      top: 16,
      left: 16,
      height: 44,
      width: 44,
      borderRadius: 22,
      backgroundColor: '#00ff58',
      paddingLeft: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonBack: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      width: '100%',
      height: 84,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 26,
      lineHeight: 28,
      color: '#FFFFFF',
      fontFamily: Fonts.Tajawal_700Bold,
      textAlign: 'center',
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.gradientContainer}>
          <LinearGradient
            colors={['#2A954F', '#2A954F']}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
          />
          <LinearGradient
            colors={['#00137d', '#00137d']}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <LinearGradient
            colors={['#00137d', '#00137d']}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{news.title}</Text>
        </View>
        <WebView style={styles.container} source={{ uri: newsUrl }} />
        <View style={styles.backIconContainer}>
          <Pressable onPress={onPressBackAction} style={styles.buttonBack}>
            <MaterialIcons name="arrow-back-ios" size={40} color="#fff" />
          </Pressable>
        </View>
      </View>
    </>
  );
}

