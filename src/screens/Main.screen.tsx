import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Linking,
  StyleSheet,
  View,
  Share,
  TouchableOpacity,
  Switch,
  ToastAndroid,
  Modal,
  ImageBackground,
  Platform,
  AppState,
  Dimensions,
  Easing,
  Animated,
  Alert,
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";

import { parseString } from "react-native-xml2js";
import KeepAwake from "react-native-keep-awake";
import MusicControl from "react-native-music-control";

import CheckBox from "@react-native-community/checkbox";
import { RouteProp, StackNavigationProp } from "@react-navigation/stack";
import {
  useIsFocused,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { BarIndicator } from "react-native-indicators";
import { PulseIndicator } from "react-native-indicators";
import { Audio } from "expo-av";

import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import RNExitApp from "react-native-exit-app";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Carousel } from "../components/";

import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import * as BackgroundFetch from "expo-background-fetch";

import { RootStackParamList } from "../routes/types.route";
import Text from "../components/Text.component";
import Pressable from "../components/Pressable.component";
import { language } from "../languages";
import Menu from "../components/Menu.component";
import { Fonts } from "../styles/fonts.style";
import { useDatabase } from "./DatabaseContext";

export enum StatusEnum {
  PLAYING = "playing",
  PAUSED = "paused",
  STOPPED = "stopped",
  BUFFERING = "buffering",
}
KeepAwake.activate();
export default function MainScreen({ navigation, route }: MainProps) {
  console.log('route',route)
  const { currentDbKey, setCurrentDbKey, isDbConnectionChanged } =
    useDatabase();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [userConsent, setUserConsent] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);

  const appState = useRef(AppState.currentState);
  const isMounted = useRef(true);
  const { main, share } = language;
  const [songTitle, setSongTitle] = useState(null);

  const [albumCoverUrl, setAlbumCoverUrl] = useState(null);
  const [trackName, setTrackName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [trackTimeMillis, setTrackTimeMillis] = useState(0);

  const trackTimeSeconds = Math.round(trackTimeMillis / 1000);
  const trackTimeMinutes = Math.floor(trackTimeSeconds / 60);
  const remainingSeconds = trackTimeSeconds % 60;

  // Obter as dimensões da janela
  const { width: windowWidth } = Dimensions.get("window");
  const windowHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const {
    radioName,
    radioImageUrl,
    radioPub1Url,
    radioPub2Url,
    radioPub3Url,
    radioStream,
    tvStream,
    programList,
    newsUrl,
    radioInstagram,
    radioFacebook,
    radioWpp,
    radioSite,
    radioYoutube,
    radioOnelink,
    admobInterId,
  } = route.params;
  console.log('radioName',radioName)

  useEffect(() => {
    const checkUserConsent = async () => {
      try {
        const userConsentValue = await AsyncStorage.getItem("@UserConsent");
        if (userConsentValue === null) {
          setShowConsentModal(true);
        } else {
          setUserConsent(true);
        }
      } catch (error) {
        console.error("Falha ao ler o estado de consentimento", error);
      }
    };

    checkUserConsent();
  }, []);

  useEffect(() => {
    stopSound();
  }, [isDbConnectionChanged]);

  const handleUserConsent = async () => {
    if (isCheckboxSelected) {
      try {
        // Salvar consentimento do usuário e atualizar estados
        await AsyncStorage.setItem("@UserConsent", "true");
        setShowConsentModal(false); // Isso fará o modal desaparecer
        setUserConsent(true); // Atualiza o estado para refletir que o usuário deu consentimento
      } catch (error) {
        console.error("Falha ao salvar o estado de consentimento", error);
      }
    }
  };

  const handleUserDisagreement = () => {
    setShowConsentModal(false);
    // Fechar app no Android, mostrar alerta no iOS
    if (Platform.OS === "android") {
      RNExitApp.exitApp();
    } else {
      Alert.alert(
        "Consentimento necessário",
        "Você precisa aceitar os termos para usar o aplicativo."
      );
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("A permissão de notificação falhou!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: "@livecenterhost/baianafm",
          projectId: "baianafm-655c9",
        })
      ).data;
    } else {
      alert("Use um dispositivo fisico para exibir Notificações");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      if (notification.request.content.data.action === "play_or_pause") {
        if (status === StatusEnum.PLAYING) {
          await stopSound();
          setStatus(StatusEnum.STOPPED);
        } else {
          await playSound();
          setStatus(StatusEnum.PLAYING);
        }
      }

      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });

  useEffect(() => {
    const xmlUrl = admobInterId; // Sua URL aqui
    const setDefaultState = () => {
      setAlbumCoverUrl(semcapa);
      setTrackName(semtex);
      setArtistName(semtex2);
    };

    const fetchSongData = () => {
      axios
        .get(xmlUrl)
        .then((response) => {
          const xmlData = response.data;

          parseString(xmlData, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }

            // Extraindo SONGTITLE e SERVERTITLE do resultado
            const songTitle = result.SHOUTCASTSERVER.SONGTITLE[0];

            // Atualizando o estado
            setSongTitle(songTitle);

            // Procurando o título da música no iTunes
            fetch(
              `https://itunes.apple.com/search?term=${songTitle}&media=music&limit=1`
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.results.length > 0) {
                  const trackData = data.results[0];

                  // Extraindo dados da faixa do resultado
                  const trackName = trackData.trackName;
                  const albumCoverUrl = trackData.artworkUrl100;
                  const artistName = trackData.artistName;
                  const trackTimeMillis = trackData.trackTimeMillis;

                  // Atualizando o estado
                  setTrackName(trackName);
                  setAlbumCoverUrl(albumCoverUrl);
                  setArtistName(artistName);
                  setTrackTimeMillis(trackTimeMillis);
                } else {
                  console.log("Musica OK.");
                  setDefaultState();
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                setDefaultState();
              });
          });
        })
        .catch((error) => {
          console.error(`Erro ao buscar XML: ${error}`);
        });
    };

    // Executar imediatamente na montagem
    fetchSongData();

    // Executar a cada 5 segundos
    const intervalId = setInterval(fetchSongData, 5000);

    // Limpar intervalo na desmontagem
    return () => clearInterval(intervalId);
  }, [currentDbKey, setCurrentDbKey]);

  const handleBackButton = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
    return true; // OVERRIDE BACK BUTTON EVENTO PADRAO
  };

  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => subscription.remove();
  });

  const [sound, setSound] = useState({} as Audio.Sound);
  const [status, setStatus] = useState(StatusEnum.STOPPED as StatusEnum);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isShown, setIsShown] = useState(true);

  const scale = useRef(new Animated.Value(1)).current;
  let animation;

  useEffect(() => {
    if (status === StatusEnum.PLAYING) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.02,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animation) {
      animation.stop();
      scale.setValue(1);
    }
  }, [status]);

  const [isActive, setIsActive] = useState(false);

  const scrollAnim = useRef(new Animated.Value(windowWidth)).current;

  const runAnimation = () => {
    scrollAnim.setValue(windowWidth);
    const animation = Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -windowWidth,
        duration: 7000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad),
      }),
      { resetBeforeIteration: true }
    );

    animation.start();
  };

  useEffect(() => {
    if (status === StatusEnum.PLAYING) {
      runAnimation();
    } else {
      Animated.timing(scrollAnim, { toValue: windowWidth, duration: 0 }).stop(); // pare a animação se a condição não for atendida
    }

    return () => {
      Animated.timing(scrollAnim, { toValue: windowWidth, duration: 0 }).stop(); // parar a animação quando o componente desmontar
    };
  }, [scrollAnim, trackName, artistName, status]); // removi isActive das dependências

  useEffect(() => {
    const setAudio = async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      if (userConsent) {
        onPressRadioAction();
      }
    };

    setAudio();
  }, [sound, userConsent,currentDbKey]);

  const playSound = async () => {
    setStatus(StatusEnum.BUFFERING);
    const { sound } = await Audio.Sound.createAsync({ uri: radioStream });
    setSound(sound);
    setStatus(StatusEnum.PLAYING);
    await sound.playAsync();
  };

  const stopSound = async () => {
    if (sound.unloadAsync != null) {
      sound.unloadAsync();
      setStatus(StatusEnum.STOPPED);
    }
  };

  const onPressRadioAction = async () => {
    if (status === StatusEnum.STOPPED || status === StatusEnum.PAUSED) {
      playSound();
    } else if (status === StatusEnum.PLAYING) {
      stopSound();
    }
  };

  const setupMusicControl = () => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.on("play", async () => {
      await playSound();
      setStatus(StatusEnum.PLAYING);
    });

    MusicControl.on("pause", async () => {
      await stopSound();
      setStatus(StatusEnum.STOPPED);
    });

    MusicControl.setNowPlaying({
      title: radioName,
      artwork: radioImageUrl,
      artist: "Ouvindo...",
    });
  };

  useEffect(() => {
    // Defina o MusicControl ao carregar o componente.
    setupMusicControl();

    // Criar um intervalo que é executado a cada 2 minutos (120000 milissegundos).
    const intervalId = setInterval(() => {
      setupMusicControl();
    }, 120000);

    // Limpe o intervalo e pare o som quando o componente for desmontado.
    return () => {
      clearInterval(intervalId);
      MusicControl.resetNowPlaying();
      stopSound();
    };
  }, []);
  const onPressTvAction = () => {
    if (status === StatusEnum.PLAYING) {
      stopSound();
    }
    navigation.navigate("TvStream", {
      tvStream,
      radioPub1Url,
      radioPub2Url,
      radioPub3Url,
      radioInstagram,
      radioFacebook,
      radioWpp,
      radioYoutube,
      radioSite,
    });
  };

  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    return () => subscription.remove();
  });

  const handleCloseApp = async () => {
    Alert.alert(
      "Você está saindo do Aplicativo!",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: () => {
            // Agora feche o aplicativo
            RNExitApp.exitApp();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const openURL = () => {
    const url = "https://www.livecenter.host/politica/"; // Substitua por seu URL real
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`Não foi possível abrir a URL: ${url}`);
        }
      })
      .catch((err) => console.error("Ocorreu um erro:", err));
  };

  const semcapa = radioImageUrl;
  let semtex = null; // primeira definição
  semtex = "Você está ouvindo"; // reatribuição
  const semtex2 = radioName;

  const onPressMenuAction = () => {
    setMenuVisible(!menuVisible);
  };

  const onPressShareAction = async () => {
    const result = await Share.share(
      {
        message: share.message.replace("{{oneLinkUrl}}", radioOnelink),
        url: radioOnelink,
        title: share.title,
      },
      {
        dialogTitle: share.dialogTitle,
        subject: share.subject,
        tintColor: "#ffffff",
      }
    );
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
      } else {
        // Shared
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
    }
  };

  const onPressSocial = (url: string) => {
    Linking.openURL(url);
  };

  const styles = StyleSheet.create({
    Container: {
      backgroundColor: "#2A954F",
      flex: 1,
      width: "100%",
    },
    logobg: {
      width: "100%",
      flex: 1,
      zIndex: 3, // Adicione esta linha
      resizeMode: "cover",
      justifyContent: "center",
    },
    ef: {
      alignSelf: "center",

      height: "100%",
      width: "100%",
    },
    gradientContainer: {
      backgroundColor: "rgba(105, 73, 162, 0.0)",
      flex: 1,
      width: "100%",
      height: "75%",

      justifyContent: "center",
    },
    gradient: {
      flex: 1,
      height: "110%",
    },
    image: {
      alignSelf: "center",
      position: "absolute",
      height: "70%",
      width: "70%",
      overflow: "hidden",
      bottom: "15%", // ou qualquer valor que você deseja
    },
    image2: {
      backgroundColor: "#ffffff",
      alignSelf: "center",
      position: "absolute",
      height: "15.58%", // 80% de 19.48%
      width: "19.2%", // 80% de 24%
      overflow: "hidden",
      bottom: "2%",
      left: "6%",
      borderRadius: 99999,
    },

    // barra das redes sociais
    socialContainer: {
      height: 80,
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2A954F",
      borderRadius: 40, // Ajuste conforme necessário
      marginLeft: "auto",
      marginRight: "auto",
      shadowColor: "#000", // Cor da sombra
      shadowOffset: {
        width: 0, // Deslocamento horizontal da sombra
        height: 2, // Deslocamento vertical da sombra
      },
      shadowOpacity: 0.25, // Opacidade da sombra
      shadowRadius: 3.84, // Raio do borrão da sombra
      elevation: 5, // Altura da sombra para Android
    },

    barsContainer: {
      position: "absolute",
      marginBottom: "-5%",
    },
    barsContainer2: {
      alignSelf: "center",
      position: "absolute",
      borderRadius: 12,
      overflow: "hidden",
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
      height: 150,
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    mediaAction: {
      bottom: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    statusText: {
      bottom: 0,
      fontSize: 24,
      color: "#000000",
      fontFamily: Fonts.Tajawal_500Medium,
    },
    button: {
      paddingLeft: status === StatusEnum.BUFFERING ? 0 : 4,
      marginTop: 5,
      height: 75,
      width: 75,
      backgroundColor: "rgba(0, 0, 0, 0)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 40,
      borderWidth: 7,
      borderColor: "#000000",
    },
    buttonTv: {
      marginTop: 3,
      height: 80,
      width: 80,
      backgroundColor: "rgba(0, 0, 0, 0)",
      justifyContent: "center",
      alignItems: "center",
    },
    publicidade: {
      //      backgroundColor: '#ffffff',
    },

    carousel: {
      justifyContent: "center",
      alignItems: "center",
      bottom: 0,
      width: "100%",
      height: "30%",
    },
    menuIconContainerradios: {
      position: "absolute",
      top: 0,
      left: "5%",
      height: "15%",
      width: "15%",
    },
    menuIconContainer: {
      position: "absolute",
      top: "7%",
      left: "5%",
      height: "15%",
      width: "15%",
    },
    buttonMenu: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      color: "#2C48AB",
    },
    shareIconContainer: {
      position: "absolute",
      top: "3.05%",
      right: "5%",
      height: "9%",
      width: "12%",
    },
    closeIconContainer: {
      position: "absolute",
      top: "75%",
      right: "10%",
      marginTop: "20%",
    },

    buttonShare: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    cont: {
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "0%",
      //  backgroundColor: '#160769',
      height: 80,
      marginLeft: "-15%",
    },

    b: {
      marginLeft: "60%",
      marginTop: -10,
    },
    meta: {
      backgroundColor: "rgba(250, 250, 250, 0.8)",
      width: "85%",
      paddingVertical: 3,
      paddingHorizontal: 20,
      borderRadius: 30,
      shadowColor: "#000",
      overflow: "hidden",
      position: "absolute",
      bottom: "6%",

      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000", // Cor da sombra
      shadowOffset: {
        width: 0, // Deslocamento horizontal da sombra
        height: 1, // Deslocamento vertical da sombra
      },
      shadowOpacity: 0.25, // Opacidade da sombra
      shadowRadius: 3.84, // Raio do borrão da sombra
      elevation: 5, // Altura da sombra para Android
    },
    trackName: {
      fontSize: windowWidth * 0.045,
      fontWeight: "bold",
      color: "#007EBB",
    },
    artistName: {
      fontSize: windowWidth * 0.045,
      fontStyle: "italic",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido para foco no modal
    },
    modalView: {
      marginTop: 20, // adicionado um espaço no topo em vez de margem uniforme
      marginBottom: 0, // removido a margem inferior para alinhar no topo
      backgroundColor: "white",
      borderRadius: 20, // arredondado apenas os cantos superiores

      padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      // mantém o modal na parte superior da tela, mesmo com scroll
      position: "absolute",
      top: 0, // posiciona no topo da tela
      left: 0,
      right: 0,
    },
    modalTitle: {
      fontSize: 22, // Tamanho maior para destaque
      fontWeight: "bold", // Torna o título mais proeminente
      color: "#333", // Cor escura para contraste com o fundo claro
      marginBottom: 10, // Espaço abaixo do título para separá-lo do texto
      textAlign: "center", // Centraliza o título no modal
    },

    modalText: {
      fontSize: 18,
      marginBottom: 15,
      textAlign: "center", // Modificado para justificar à esquerda
      color: "#333", // Mantém o texto escuro para contraste
      lineHeight: 24, // Aumenta a altura da linha para melhorar a legibilidade
      fontWeight: "400", // Normal. Considere '500' para semibold se precisar de destaque
    },
    boldText: {
      fontWeight: "bold",
      fontSize: 16,
      bottom: -5,
    },

    buttonm: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 2,
      backgroundColor: "#4CAF50", // Um verde atraente para ação positiva
      width: "40%", // Largura do botão
      marginBottom: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonDisagree: {
      backgroundColor: "#F44336", // Vermelho para ação negativa
    },
    checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
      alignItems: "center",
    },
    checkbox: {
      alignSelf: "center",
      bottom: 8,
    },
    label: {
      margin: 8,
      color: "#000", // Cor do texto, ajuste conforme necessário
      fontSize: 16, // Tamanho do texto, ajuste conforme necessário
    },

    logo: {
      width: 100, // 100 pixels de largura
      height: 100, // 100 pixels de altura
      resizeMode: "contain", // Mantém as proporções da imagem enquanto a redimensiona
    },

    text: {
      fontSize: 16,
      marginBottom: -20,
      color: "#007EBB",
    },
  });

  return (
    <>
      <View style={styles.Container}>
        {showConsentModal && (
          <Modal
            visible={showConsentModal}
            transparent={true}
            onRequestClose={handleUserDisagreement}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Política de Privacidade</Text>

                <Text style={styles.modalText}>
                  O aplicativo <Text style={styles.boldText}>{semtex2}</Text>,
                  coleta, transmite, sincroniza e armazena os dados de navegação
                  e imagens para ativar recursos de estatísticas e audiência. A
                  coleta inclui,informações sobre as músicas visitadas, o tempo
                  gasto em cada música, as interações realizadas, e outras
                  atividades de navegação dentro do aplicativo, bem como imagens
                  que você possa enviar ou utilizar. Este processo ajuda a LIVE
                  CENTER HOST melhorar a qualidade dos nossos serviços e a
                  oferecer uma experiência personalizada, não compartilhamos as
                  imagem com terceiros. Neste cenário, é essencial que você
                  aceite os termos da nossa política de privacidade.
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <CheckBox
                    value={isCheckboxSelected}
                    onValueChange={setIsCheckboxSelected}
                    style={styles.checkbox}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Text style={{ marginLeft: 8, fontSize: 16 }}>
                      Eu aceito os{" "}
                      <Pressable onPress={openURL}>
                        <Text style={styles.boldText}>TERMOS</Text>
                      </Pressable>{" "}
                      e condições.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.buttonm}
                  onPress={handleUserConsent}
                  disabled={!isCheckboxSelected}
                >
                  <Text style={styles.buttonText}>Aceitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonm, styles.buttonDisagree]}
                  onPress={handleUserDisagreement}
                >
                  <Text style={styles.buttonText}>Não Aceito</Text>
                </TouchableOpacity>
                <Image
                  source={require("../../assets/live.png")}
                  style={styles.logo}
                />
              </View>
            </View>
          </Modal>
        )}
        {!showConsentModal && (
          <ImageBackground
            source={require("../../assets/bgtotal.png")}
            style={styles.logobg}
          >
            <View style={styles.gradientContainer}>
              {status === StatusEnum.PLAYING ? (
                <Image
                  style={styles.image}
                  source={{ uri: radioImageUrl }}
                  resizeMode="contain"
                />
              ) : null}
              {status === StatusEnum.PLAYING ? (
                <View style={styles.meta}>
                  <Animated.View
                    style={{
                      flexDirection: "row",
                      transform: [{ translateX: scrollAnim }],
                    }}
                  >
                    <View style={{ flexDirection: "row", width: windowWidth }}>
                      <Text style={styles.trackName}>{trackName} </Text>
                      <Text style={styles.artistName}>{artistName}</Text>
                    </View>
                  </Animated.View>
                </View>
              ) : null}

              {status === StatusEnum.PLAYING && Platform.OS === "ios" ? (
                // Código para iOS quando StatusEnum.PLAYING
                <Animated.Image
                  style={[styles.image2, { transform: [{ scale }] }]}
                  source={{ uri: radioImageUrl }}
                  resizeMode="contain"
                />
              ) : status === StatusEnum.PLAYING ? (
                // Código para outras plataformas quando StatusEnum.PLAYING
                <Animated.Image
                  style={[styles.image2, { transform: [{ scale }] }]}
                  source={{ uri: albumCoverUrl }}
                  resizeMode="contain"
                />
              ) : (
                // Código para qualquer plataforma quando o status é diferente de StatusEnum.PLAYING
                <Image
                  style={styles.image}
                  source={{ uri: radioImageUrl }}
                  resizeMode="contain"
                />
              )}
            </View>

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
                    style={{ width: 35, height: 35 }}
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
            <View style={styles.mediaActionsContainer}>
              <View style={styles.mediaAction}>
                <Text style={styles.statusText}>
                  {status === StatusEnum.STOPPED
                    ? main.stopped
                    : status === StatusEnum.PAUSED
                    ? main.paused
                    : status === StatusEnum.BUFFERING
                    ? main.buffering
                    : main.playing}
                </Text>
                <Pressable
                  onPress={onPressRadioAction}
                  style={styles.button}
                  disabled={status === StatusEnum.BUFFERING}
                >
                  {(status === StatusEnum.STOPPED ||
                    status === StatusEnum.PAUSED) && (
                    <Ionicons name="play" size={45} color="#000000" />
                  )}
                  {status === StatusEnum.PLAYING && (
                    <Ionicons name="pause" size={45} color="#000000" />
                  )}
                  {status === StatusEnum.BUFFERING && (
                    <ActivityIndicator size={45} color="#000000" />
                  )}
                </Pressable>
              </View>
              <View style={styles.mediaAction}>
                <Text style={styles.statusText}>{main.watch}</Text>
                <Pressable onPress={onPressTvAction} style={styles.buttonTv}>
                  <MaterialIcons name="live-tv" size={80} color="#000000" />
                </Pressable>
              </View>

              {status === StatusEnum.PLAYING && (
                <View style={styles.barsContainer}>
                  <BarIndicator
                    color="#000000"
                    count={6}
                    size={30}
                    style={styles.indicator}
                  />
                </View>
              )}
            </View>

            <View style={styles.menuIconContainerradios}>
              <Pressable
                onPress={() => navigation.navigate("Radio")}
                style={styles.buttonMenu}
              >
                <MaterialCommunityIcons
                  name="microsoft-xbox-controller-menu"
                  size={screenWidth * 0.15}
                  color="#7a2605"
                />
              </Pressable>
            </View>
            <View style={styles.menuIconContainer}>
              <Pressable onPress={onPressMenuAction} style={styles.buttonMenu}>
                <MaterialCommunityIcons
                  name="microsoft-xbox-controller-menu"
                  size={screenWidth * 0.15}
                  color="#2A954F"
                />
              </Pressable>
            </View>

            <View style={styles.shareIconContainer}>
              {Platform.OS === "android" && (
                <TouchableOpacity
                  onPress={handleCloseApp}
                  style={styles.closeIconContainer}
                >
                  <Ionicons
                    name="close"
                    size={screenWidth * 0.1}
                    color="#c90202"
                  />
                </TouchableOpacity>
              )}
              <Pressable
                onPress={onPressShareAction}
                style={styles.buttonShare}
              >
                <FontAwesome
                  name="share-alt-square"
                  size={screenWidth * 0.12}
                  color="#2A954F"
                />
              </Pressable>
            </View>
            <View style={styles.publicidade}>
              <Carousel style={styles.carousel} route={route} />
            </View>

            <Menu
              visible={menuVisible}
              setVisible={setMenuVisible}
              onPressNews={() => {
                navigation.navigate("News", { newsUrl });
              }}
              onPressProgram={() => {
                navigation.navigate("Program", { programList });
              }}
              onPressTvStream={() => {
                onPressTvAction();
              }}
            />
          </ImageBackground>
        )}
      </View>
    </>
  );
}
