import React from 'react';
import { StyleSheet,  ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIndicator } from 'react-native-indicators';

export default function SplashScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
    },

    gradient: {
      flex: 1,
      height: '110%',
    },
    indicator: {
      flex: 1,

    },

	 logobg: {
    width: '100%',
     
      alignSelf: 'center',
	    flex: 1,
    justifyContent: 'center',
	
  },
  });

  return (
    <>
      <View style={styles.container}>
	   <ImageBackground source={require('../../assets/splash_carregando.png')} style={styles.logobg}>
        <View style={styles.gradientContainer}>
		
         
		  		
        </View>

        <MaterialIndicator
          color="#fff"
          count={3}
          size={34}
          style={styles.indicator}
        />
  </ImageBackground>
      </View>
    </>
  );
}

