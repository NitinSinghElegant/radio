import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { initializeApp, getApps, deleteApp, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { useDatabase } from "./DatabaseContext";
import { Asset } from "expo-asset";
import topImage from "../../assets/images/topImage.png";
import image1 from "../../assets/images/image1.png";
import image2 from "../../assets/images/image2.png";
import image3 from "../../assets/images/image3.png";
import image4 from "../../assets/images/image4.png";
import image5 from "../../assets/images/image5.png";
import image6 from "../../assets/images/image6.png";
import image7 from "../../assets/images/image7.png";
import { AppConfigType } from "../../App";
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
} from "../../src/utils/constants.util";

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

const dbImages = {
  db1: image1,
  db2: image2,
  db3: image3,
  db4: image4,
  db5: image5,
  db6: image6,
  db7: image7,
};
const RadioScreen = (props) => {
  const { currentDbKey, setCurrentDbKey, setIsDbConnectionChanged } =
    useDatabase();
  let [appConfig, setAppConfig] = useState<AppConfigType>({} as AppConfigType);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async (dbKey) => {
    // Supondo que você queira fazer algo mais ao mudar o banco de dados

    try {
      setIsDbConnectionChanged(dbKey);
      setIsLoading(true);
        // Deleta todos os apps existentes antes de inicializar um novo
        const apps = getApps();
        if (apps.length > 0) {
          await deleteApp(apps[0]);
        }
      // Inicializa o Firebase com o banco de dados selecionado
      initializeApp(firebaseConfig[dbKey]);
      await getFirebaseData();
      await cacheResources();
    } catch (error) {
      console.error("Erro ao configurar o Firebase:", error);
      setIsLoading(false);
    } finally {
      console.log(`db connection has been changed successfully`);
      setCurrentDbKey(dbKey);
      setIsLoading(false);
      props.navigation.navigate("Main", appConfig);
      
    }
  };
  const getFirebaseData = async () => {
    const db = getDatabase();
    const reference = ref(db, "app_config");
    console.log('db reference',reference)
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

    await Promise.all(cacheImages).then(() =>
      console.log("cacheResources resolved ")
    );
  };

  return (
    <View style={styles.container}>
      <Text>Escolha o Banco de Dados:</Text>
      <View style={styles.imageContainer}>
        {Object.keys(dbImages).map((dbKey) => {
          const image = dbImages[dbKey];
          return (
            <TouchableOpacity
              key={dbKey}
              onPress={() => handlePress(dbKey)}
              disabled={currentDbKey === dbKey || isLoading}
            >
              <Image source={image} style={styles.dbImage} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  dbImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    margin: 10,
  },
});

export default RadioScreen;
