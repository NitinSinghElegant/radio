import React, { useState, useRef, useEffect } from "react";
import { BackHandler, StyleSheet,  Image, View, Linking } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ResizeMode, Video, AVPlaybackStatus } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from 'expo-status-bar';

import { Carousel } from '../components/';
import { RootStackParamList } from "../routes/types.route";
import Text from "../components/Text.component";
import Pressable from "../components/Pressable.component";
import { language } from "../languages";
import { Fonts } from "../styles/fonts.style";
import { StatusEnum } from "./Main.screen";
import KeepAwake from 'react-native-keep-awake';


let checkFS: number | null = null;
KeepAwake.activate();
export default function TvStreamScreen({ navigation, route }: TvStreamProps) {
  const {
    tvStream,
    radioInstagram,
    radioFacebook,
    radioWpp,
    radioSite,
	radioYoutube,
  } = route.params;
  const { tvStream: tvLanguage, main } = language;

  const [status, setStatus] = useState(StatusEnum.STOPPED as StatusEnum);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const videoRef = useRef(null);

  const updateScreenOrientation = async (isFullScreen: boolean) => {
    await ScreenOrientation.lockAsync(
      isFullScreen
        ? ScreenOrientation.OrientationLock.LANDSCAPE
        : ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  useEffect(() => {
    updateScreenOrientation(fullScreen);
  }, [fullScreen]);

  const handleBackButton = () => {
    navigation.goBack();
    return true; // OVERRIDE BACK BUTTON EVENTO PADRAO
  };

  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => subscription.remove();
  });

const onPressBackAction = async () => {
    await stopVideo(); // Para o vídeo
    navigation.goBack();
};

const playVideo = async () => {
    // setStatus(StatusEnum.PLAYING);
    await videoRef.current.playAsync();
};

const stopVideo = async () => {
    await videoRef.current.pauseAsync();
    setStatus(StatusEnum.STOPPED);
};


  const onPressTvAction = async () => {
    if (status === StatusEnum.STOPPED || status === StatusEnum.PAUSED) {
      playVideo();
    }
    // } else if (status === StatusEnum.PLAYING) {
    //   stopVideo();
    // }
  };

  const onPressSocial = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{tvLanguage.title}</Text>
{/* 
        {status === StatusEnum.PLAYING && (
          <Image
            style={{
              ...styles.aovivo,
              opacity: 0.9, // 0 para totalmente transparente, 1 para totalmente opaco
            }}
            source={require("../../assets/ao-vivo.gif")}
            resizeMode="contain"
          />
        )} */}
      </View>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={{
            flex: 1,
          }}
          source={{
            uri: tvStream,
          }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          onFullscreenUpdate={(e) => {
            if (checkFS === 1) {
              setFullScreen((p) => !p);
              checkFS = 0;
            } else {
              checkFS = 1;
            }
          }}
          onLoad={onPressTvAction}
        />
      </View>

      <LinearGradient
        colors={["#000000", "#505152", "#0f0f0f"]} // Altere para as cores que você deseja usar
        style={styles.socialContainer}
      >
        {
          <View style={styles.socialContainer}>
            {radioWpp != null && (
              <Pressable
                style={styles.socialIconContainer}
                onPress={() => onPressSocial(radioWpp)}
              >
                <Ionicons name="logo-whatsapp" size={40} color="#FFFFFF" />
              </Pressable>
            )}
            {radioYoutube != null && (
              <Pressable
                style={styles.socialIconContainer}
                onPress={() => onPressSocial(radioYoutube)}
              >
                <SimpleLineIcons
                  name="social-youtube"
                  size={48}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
            {radioInstagram != null && (
              <Pressable
                style={styles.socialIconContainer}
                onPress={() => onPressSocial(radioInstagram)}
              >
                <Ionicons name="logo-instagram" size={40} color="#FFFFFF" />
              </Pressable>
            )}

            {radioFacebook != null && (
              <Pressable
                style={styles.socialIconContainer}
                onPress={() => onPressSocial(radioFacebook)}
              >
                <Image
                  source={require("../../assets/facebook.png")}
                  style={{ width: 33, height: 33 }}
                />
              </Pressable>
            )}

            {radioSite != null && (
              <Pressable
                style={styles.socialIconContainer}
                onPress={() => onPressSocial(radioSite)}
              >
                <Ionicons name="globe-outline" size={40} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        }
      </LinearGradient>
      <View style={styles.mediaActionsContainer}>
        <View style={styles.mediaAction}>
          <Text style={styles.statusText}>
            {status === StatusEnum.STOPPED ? main.watch : tvLanguage.watching}
          </Text>
          <Pressable onPress={onPressTvAction} style={styles.buttonTv}>
            {(status === StatusEnum.STOPPED ||
              status === StatusEnum.PAUSED) && (
              <Ionicons name="play" size={48} color="#fff" />
            )}
            {/* {status === StatusEnum.PLAYING && (
              <Ionicons name="pause" size={48} color="#fff" />
            )} */}
          </Pressable>
        </View>
      </View>

      <Carousel style={styles.carousel} route={route} />

      <View style={styles.backIconContainer}>
        <Pressable onPress={onPressBackAction} style={styles.buttonBack}>
          <MaterialIcons name="arrow-back-ios" size={40} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A954F",
  },
  gradientContainer: {
    position: "absolute",
    height: "100%",
    flex: 1,
    width: "100%",
  },
  gradient: {
    flex: 1,
    height: "110%",
  },
  backIconContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: "#00ff58",
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    lineHeight: 28,
    color: "#fff",
    fontFamily: Fonts.Tajawal_700Bold,
    textAlign: "center",
  },
  videoContainer: {

	height: "39%",
    backgroundColor: "#000000",
	borderTopLeftRadius: 20,  // Ajuste conforme necessário
    borderTopRightRadius: 20,  // Ajuste conforme necessário
  },
  socialContainer: {
    height: 96,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
	    borderBottomLeftRadius: 40,  // Ajuste conforme necessário
    borderBottomRightRadius: 40,  // Ajuste conforme necessário

  },
  barsContainer: {
    position: "absolute",
    bottom: -22,
  },
  indicator: {
    flex: 0,
  },
  socialIconContainer: {
    marginHorizontal: 8,
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  mediaActionsContainer: {
    height: 156,
    width: "100%",
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
  },
  mediaAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 24,
    color: "#fff",
    fontFamily: Fonts.Tajawal_500Medium,
  },
  buttonTv: {
    paddingLeft: 4,
    marginTop: 12,
    height: 80,
    width: 80,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#fff",
    borderRadius: 40,
  },

    carousel: {
    justifyContent: "center",
    alignItems: "center",
  bottom: '0%',
  width: "100%",
    height: "30%",
    backgroundColor: "#FFC200",

},
    aovivo: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
	
  },
});

