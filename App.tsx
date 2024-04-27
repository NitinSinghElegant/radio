// App.tsx
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  StatusBar as StatusBarReactNative,
  Platform,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "@expo-google-fonts/tajawal";
import { Asset } from "expo-asset";
import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

import Navigation from "./src/routes";
import { TajawalFonts } from "./src/styles/fonts.style";
import {
  RADIO_NAME,
  LOGO_IMAGE_URL,
  PUB_IMAGE1_URL,
  PUB_IMAGE2_URL,
  PUB_IMAGE3_URL,
  RADIO_STREAM_URL,
  TV_STREAM_URL,
  PROGRAMACAO,
  NEWS_URL,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  WPP_URL,
  SITE_URL,
  YOUTUBE_URL,
  ONELINK_URL,
  INTER_ID,
  BANNER_ID,
} from "./src/utils/constants.util";
import SplashScreen from "./src/screens/Splash.screen";
import { ProgramItem } from "./src/routes/types.route";
import DatabaseSwitcher from "./src/screens/Radio.screen";
import { DatabaseProvider } from "./src/screens/DatabaseContext";

export type AppConfigType = {
  radioName: string;
  radioStream: string;
  tvStream: string;
  programList: ProgramItem[];
  newsUrl: string;
  radioImageUrl: string;
  radioPub1Url: string;
  radioPub2Url: string;
  radioPub3Url: string;
  radioInstagram: string;
  radioFacebook: string;
  radioWpp: string;
  radioSite: string;
  radioYoutube: string;
  radioOnelink: string;
  admobInterId: string;
  admobBannerId: string;
};

const firebaseConfig = {
  db1: {
    apiKey: "AIzaSyCDsch3I1krMSg3VBfM7DmapW0zAKlTWhI",
    authDomain: "radio-correio-delmiro.firebaseapp.com",
    databaseURL: "https://radio-correio-delmiro-default-rtdb.firebaseio.com",
    projectId: "radio-correio-delmiro",
    storageBucket: "radio-correio-delmiro.appspot.com",
    messagingSenderId: "1032925588527",
    appId:
      Platform.OS === "android"
        ? "1:1032925588527:android:fe9017e7c1efa7913f2ada"
        : "1:1032925588527:ios:4fa3d2b340eaba4a3f2ada",
    measurementId: "G-KXH0DTSF3C",
  },
  db2: {
    apiKey: "AIzaSyAq5dWh2SUx1bBnNoUuOGy9lwI2Odz_Hj0",
    authDomain: "radio-garden-web.firebaseapp.com",
    databaseURL: "https://radio-garden-web-default-rtdb.firebaseio.com",
    projectId: "radio-garden-web",
    storageBucket: "radio-garden-web.appspot.com",
    messagingSenderId: "984017093770",
    appId: "1:984017093770:web:7eadeaa73dbc0107279973",
    measurementId: "G-JSL42PM6LB",
  },
  db3: {
    apiKey: "AIzaSyCDsch3I1krMSg3VBfM7DmapW0zAKlTWhI",
    authDomain: "radio-correio-delmiro.firebaseapp.com",
    databaseURL: "https://radio-correio-delmiro-default-rtdb.firebaseio.com",
    projectId: "radio-correio-delmiro",
    storageBucket: "radio-correio-delmiro.appspot.com",
    messagingSenderId: "1032925588527",
    appId:
      Platform.OS === "android"
        ? "1:1032925588527:android:fe9017e7c1efa7913f2ada"
        : "1:1032925588527:ios:4fa3d2b340eaba4a3f2ada",
    measurementId: "G-KXH0DTSF3C",
  },
  db4: {
    apiKey: "AIzaSyCDsch3I1krMSg3VBfM7DmapW0zAKlTWhI",
    authDomain: "radio-correio-delmiro.firebaseapp.com",
    databaseURL: "https://radio-correio-delmiro-default-rtdb.firebaseio.com",
    projectId: "radio-correio-delmiro",
    storageBucket: "radio-correio-delmiro.appspot.com",
    messagingSenderId: "1032925588527",
    appId:
      Platform.OS === "android"
        ? "1:1032925588527:android:fe9017e7c1efa7913f2ada"
        : "1:1032925588527:ios:4fa3d2b340eaba4a3f2ada",
    measurementId: "G-KXH0DTSF3C",
  },
  db5: {
    apiKey: "AIzaSyCDsch3I1krMSg3VBfM7DmapW0zAKlTWhI",
    authDomain: "radio-correio-delmiro.firebaseapp.com",
    databaseURL: "https://radio-correio-delmiro-default-rtdb.firebaseio.com",
    projectId: "radio-correio-delmiro",
    storageBucket: "radio-correio-delmiro.appspot.com",
    messagingSenderId: "1032925588527",
    appId:
      Platform.OS === "android"
        ? "1:1032925588527:android:fe9017e7c1efa7913f2ada"
        : "1:1032925588527:ios:4fa3d2b340eaba4a3f2ada",
    measurementId: "G-KXH0DTSF3C",
  },
  db6: {
    apiKey: "AIzaSyCDsch3I1krMSg3VBfM7DmapW0zAKlTWhI",
    authDomain: "radio-correio-delmiro.firebaseapp.com",
    databaseURL: "https://radio-correio-delmiro-default-rtdb.firebaseio.com",
    projectId: "radio-correio-delmiro",
    storageBucket: "radio-correio-delmiro.appspot.com",
    messagingSenderId: "1032925588527",
    appId:
      Platform.OS === "android"
        ? "1:1032925588527:android:fe9017e7c1efa7913f2ada"
        : "1:1032925588527:ios:4fa3d2b340eaba4a3f2ada",
    measurementId: "G-KXH0DTSF3C",
  },
  db7: {
    apiKey: "AIzaSyCDsch3I1krMSg3VBfM7DmapW0zAKlTWhI",
    authDomain: "radio-correio-delmiro.firebaseapp.com",
    databaseURL: "https://radio-correio-delmiro-default-rtdb.firebaseio.com",
    projectId: "radio-correio-delmiro",
    storageBucket: "radio-correio-delmiro.appspot.com",
    messagingSenderId: "1032925588527",
    appId:
      Platform.OS === "android"
        ? "1:1032925588527:android:fe9017e7c1efa7913f2ada"
        : "1:1032925588527:ios:4fa3d2b340eaba4a3f2ada",
    measurementId: "G-KXH0DTSF3C",
  },
};

export default function App() {
  let [appConfig, setAppConfig] = useState<AppConfigType>({} as AppConfigType);
  let [appReady, setAppReady] = useState(false);
  let [fontsLoaded] = useFonts(TajawalFonts);
  let [currentDbKey, setCurrentDbKey] = useState("db2"); // Estado para manter a chave do banco de dados atual
  const [updateConnection, setUpdateConnection] = useState("db1");

  useEffect(() => {
    
    const loadResourcesAndData = async () => {
      try {
        // Deleta todos os apps existentes antes de inicializar um novo
        const apps = getApps();
        if (apps.length > 0) {
          await deleteApp(apps[0]);
        }

        // Inicializa o Firebase com o banco de dados selecionado
        initializeApp(firebaseConfig[updateConnection]);
        await getFirebaseData();
        await cacheResources();
      } catch (error) {
        console.error("Erro ao configurar o Firebase:", error);
      } finally {
        if (fontsLoaded) {
          setAppReady(true);
        }
      }
    };
console.log("connection udpate", currentDbKey);
    loadResourcesAndData();
  }, [fontsLoaded, currentDbKey]); // Dependências do useEffect atualizadas para incluir currentDbKey

  const getFirebaseData = async () => {
    const db = getDatabase();
    const reference = ref(db, "app_config");
    onValue(reference, (snapshot) => {
      const translatedData = snapshot.val();
      if (translatedData != null) {
        const newAppConfig: AppConfigType = {
          radioName: translatedData.RADIO_NAME,
          radioImageUrl: translatedData.LOGO_IMAGE_URL,
          radioPub1Url: translatedData.PUB_IMAGE1_URL,
          radioPub2Url: translatedData.PUB_IMAGE2_URL,
          radioPub3Url: translatedData.PUB_IMAGE3_URL,
          radioStream: translatedData.RADIO_STREAM_URL,
          tvStream: translatedData.TV_STREAM_URL,
          programList: translatedData.PROGRAMACAO,
          newsUrl: translatedData.NEWS_URL,
          radioInstagram: translatedData.INSTAGRAM_URL,
          radioFacebook: translatedData.FACEBOOK_URL,
          radioWpp: translatedData.WPP_URL,
          radioSite: translatedData.SITE_URL,
          radioYoutube: translatedData.YOUTUBE_URL,
          radioOnelink: translatedData.ONELINK_URL,
          admobInterId: translatedData.INTER_ID,
          admobBannerId: translatedData.BANNER_ID,
        };
        setAppConfig(newAppConfig);
      } else {
        setAppConfig({
          radioName: RADIO_NAME,
          radioImageUrl: LOGO_IMAGE_URL,
          radioPub1Url: PUB_IMAGE1_URL,
          radioPub2Url: PUB_IMAGE2_URL,
          radioPub3Url: PUB_IMAGE3_URL,
          radioStream: RADIO_STREAM_URL,
          tvStream: TV_STREAM_URL,
          programList: PROGRAMACAO,
          newsUrl: NEWS_URL,
          radioInstagram: INSTAGRAM_URL,
          radioFacebook: FACEBOOK_URL,
          radioWpp: WPP_URL,
          radioSite: SITE_URL,
          radioYoutube: YOUTUBE_URL,
          radioOnelink: ONELINK_URL,
          admobInterId: INTER_ID,
          admobBannerId: BANNER_ID,
        });
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 6000));
  };

  const cacheResources = async () => {
    const images: string[] = [];

    if (appConfig.radioImageUrl) {
      images.push(appConfig.radioImageUrl);
    }

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
  };
  // Função para alternar o banco de dados
  const switchDatabase = (newDbKey) => {
    setCurrentDbKey(newDbKey);
    setAppReady(false); // Reinicia o estado de pronto enquanto carrega os novos dados
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#121212",
    },
    containerIos: {
      height: 44,
      width: "100%",
      backgroundColor: "#121212",
    },
    containerAndroid: {
      marginTop: StatusBarReactNative.currentHeight,
    },
  });

  return (
    <DatabaseProvider>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#FCC509" />
        {appReady ? (
          <View
            style={[
              styles.container,
              Platform.OS === "ios"
                ? styles.containerIos
                : styles.containerAndroid,
            ]}
          >
            <Navigation
              appConfig={appConfig}
              setCurrentDbKey={setCurrentDbKey}
            />
          </View>
        ) : (
          <SplashScreen />
        )}
      </SafeAreaProvider>
    </DatabaseProvider>
  );
}

export default App;
