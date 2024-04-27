import { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Dimensions } from 'react-native';
import Animated, {
  Layout,
  FadeInLeft,
  FadeOutRight,
} from 'react-native-reanimated';

export const Carousel = ({ route }) => {
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
    admobBannerId,
  } = route.params;
  
   const DATA = [
    {
      image: radioPub1Url,
    },
    {
      image: radioPub2Url,
    },
    {
      image: radioPub3Url,
    },
  ];
  
  const [activeBanner, setActiveBanner] = useState<number>(0);
  const FlatlistRef = useRef<FlatList>(null);

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0] !== undefined) {
      setActiveBanner(viewableItems[0]?.index);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        itemVisiblePercentThreshold: 80,
      },
      onViewableItemsChanged,
    },
  ]);

  useEffect(() => {
  const timeId = setTimeout(() => {
    if (activeBanner === DATA.length - 1) { // se o banner ativo for o último
      FlatlistRef.current?.scrollToIndex({
        index: 0, // resetar para o index 0
        animated: true,
      });
      setActiveBanner(0); // resetar para o index 0
    } else {
      FlatlistRef.current?.scrollToIndex({
        index: activeBanner + 1,
        animated: true,
      });
      setActiveBanner((old) => old + 1);
    }
  }, 9000);
  return () => clearTimeout(timeId);
}, [activeBanner]);

  return (
    <View style={{ alignItems: 'center' }}>
      <FlatList
        ref={FlatlistRef}
        data={DATA}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: Dimensions.get('screen').width * 1.0,
              alignItems: 'center',
              height: '100%',

			      justifyContent: 'center',
				  

            }}
          >
            <Image
              source={{
                uri: item.image,
              }}
              style={{
                width: '100%',
                height: '100%',
                alignSelf: 'center',

				justifyContent: 'center',
				
              }}
              resizeMode='contain'
            />
          </View>
        )}
        style={{
   
		  width: '100%',
          height: 100,
		  bottom: '-2%',

        }}
        contentContainerStyle={{

        }}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        horizontal
        keyExtractor={(item, index) => String(index)}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        data={DATA}
        renderItem={({ item, index }) => (
          <Animated.View
            layout={Layout}
            entering={FadeInLeft}
            exiting={FadeOutRight}
            style={{
              width: activeBanner === index ? 12 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeBanner === index ? 'black' : 'gray',
              marginHorizontal: 2,
            }}
          />
        )}
        style={{
          alignSelf: 'center',
          bottom: '1%',
		  
        }}
        scrollEnabled={false}
        horizontal
        keyExtractor={(item, index) => String(index)}
      />
    </View>
  );
};

