import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import { AppConfigType } from '../../App';
import { RootStackParamList } from './types.route';
import { NEWS_URL, PROGRAMACAO, TV_STREAM_URL } from '../utils/constants.util';
import MainScreen from '../screens/Main.screen';
import RadioScreen from '../screens/Radio.screen';
import ProgramScreen from '../screens/Program.screen';
import NewsScreen from '../screens/News.screen';
import TvStreamScreen from '../screens/TvStream.screen';

const Stack = createStackNavigator<RootStackParamList>();
type RootNavigatorProps = {
  appConfig: AppConfigType;
  setCurrentDbKey: any;
};


function RootNavigator(props: RootNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureDirection: "horizontal-inverted",
        }}
        initialParams={props.appConfig}
      />
      <Stack.Screen
        name="Radio"
        component={RadioScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureDirection: "horizontal-inverted",
        }}
        initialParams={props}
      />
      <Stack.Screen
        name="Program"
        component={ProgramScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureDirection: "horizontal",
        }}
        initialParams={{
          programList: props.appConfig.programList,
        }}
      />
      <Stack.Screen
        name="News"
        component={NewsScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureDirection: "horizontal",
        }}
        initialParams={{
          newsUrl: props.appConfig.newsUrl,
        }}
      />
      <Stack.Screen
        name="TvStream"
        component={TvStreamScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          gestureDirection: "horizontal",
        }}
        initialParams={{
          tvStream: props.appConfig.tvStream,
          radioInstagram: props.appConfig.radioInstagram,
          radioFacebook: props.appConfig.radioFacebook,
          radioWpp: props.appConfig.radioWpp,
          radioSite: props.appConfig.radioSite,
          admobBannerId: props.appConfig.admobBannerId,
          radioPub1Url: props.appConfig.radioPub1Url,
          radioPub1Ur2: props.appConfig.radioPub1Ur2,
          radioPub1Ur3: props.appConfig.radioPub1Ur3,
        }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation(props: RootNavigatorProps) {
  return (
    <NavigationContainer>
      <RootNavigator
        appConfig={props.appConfig}
        setCurrentDbKey={props.setCurrentDbKey}
      />
    </NavigationContainer>
  );
}

