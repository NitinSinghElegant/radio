import React, { useMemo } from 'react';
import {
  BackHandler,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { ProgramItem, RootStackParamList } from '../routes/types.route';
import Pressable from '../components/Pressable.component';
import { language } from '../languages';
import Text from '../components/Text.component';
import { Fonts } from '../styles/fonts.style';

type ProgramNavigationProp = StackNavigationProp<RootStackParamList, 'Program'>;
type ProgramRouteProp = RouteProp<RootStackParamList, 'Program'>;
type ProgramProps = {
  navigation: ProgramNavigationProp;
  route: ProgramRouteProp;
};

export default function ProgramScreen({ navigation, route }: ProgramProps) {
  const { programList } = route.params;
  const { program } = language;
  

  const weekDays = [program.sun, program.mon, program.tue, program.wed, program.thu, program.fri, program.sat];
  const getWeekDayStr = (codDiaDaSemana: number) => weekDays[codDiaDaSemana];

    // Reorganizar os dados por dias da semana
  const organizedData = useMemo(() => {
    const data = {};
    programList && programList.forEach(item => {
      if (!data[item.codDiaDaSemana]) {
        data[item.codDiaDaSemana] = [];
      }
      data[item.codDiaDaSemana].push(item);
    });
    return data;
  }, [programList]);

  // Achatar os dados em uma única lista
  const flattenData = useMemo(() => {
    const data = [];
    organizedData && Object.entries(organizedData).forEach(([day, items]) => {
      // Adicione um item de 'day' para cada dia
      data.push({ type: 'day', day });
      // Adicione todos os 'items' para esse dia
      items.forEach((item) => {
        data.push({ type: 'item', item });
      });
    });
    return data;
  }, [organizedData]);


  const handleBackButton = () => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
  return true;
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
      backgroundColor: '#000000',
	  height: '100%',
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
      fontSize: 24,
      lineHeight: 28,
      color: '#FFFFFF',
      fontFamily: Fonts.Tajawal_700Bold,
      textAlign: 'center',
    },
    programItemMainContainer: {
      flexDirection: 'column', // Modificado de 'row' para 'column'

    },
    programItemDayContainer: {
	
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#457B9D',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  programItemDayText: {
    top:3,
    marginLeft: 10,
    fontSize: 20,
    lineHeight: 24,
    color: '#F1FAEE',
    fontFamily: Fonts.Tajawal_700Bold,
  },
    programItemWeekDayContainer: {
      paddingLeft: 24,
      paddingTop: 12,

      padding: 10,
    },
    programItemDiaSemana: {
      fontSize: 20,
      lineHeight: 24,
      color: '#120480',
      fontFamily: Fonts.Tajawal_700Bold,
      textAlign: 'left',

      padding: 10,
    },
    programItemTextContainer: {
      paddingLeft: 12,
    },
	programItemContainer: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  programItemInnerContainer: {
	maxWidth: 250,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  programItemHora: {
    top:3,
    marginLeft: 8,
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
    fontFamily: Fonts.Tajawal_700Bold,
  },
  programItemNome: {
  top:3,
    marginLeft: 8,
    fontSize: 22,
    lineHeight: 26,
    color: '#000000',
    fontFamily: Fonts.Tajawal_700Bold,
  },
  programItemLocutor: {
  top:3,
    marginLeft: 8,
	marginRight: '9%',
    fontSize: 18,
    lineHeight: 22,
    color: '#000000',
    fontFamily: Fonts.Tajawal_400Regular,
  },
  iconLocutor: {
    marginLeft: 0,
  },
    listFooterStyle: {
      marginBottom: 24,
    },
	
  });

const renderProgramItem = (item: ProgramItem) => (
  <LinearGradient
    colors={['#e8e8e8', '#f2f2f2', '#e8e8e8', '#f2f2f2']} 
    start={{ x: 1, y: 0 }} 
    end={{ x: 0, y: 1 }}
    style={styles.programItemContainer}
  >
    <View style={styles.programItemInnerContainer}>
      <MaterialIcons name="schedule" size={24} color="#000000" />
      <Text style={styles.programItemHora}>{item.descHora}</Text>
    </View>
    <View style={styles.programItemInnerContainer}>
      <MaterialIcons name="mic" size={24} color="#000000" style={styles.iconLocutor}/>
      <Text style={styles.programItemLocutor}>{item.descLocutor}</Text>
    </View>
    <View style={styles.programItemInnerContainer}>
      <MaterialIcons name="radio" size={24} color="#000000" />
      <Text style={styles.programItemNome}>{item.descNome}</Text>
    </View>
  </LinearGradient>
);

const ProgramDayContainer = ({ day }) => (
  <LinearGradient
    colors={['#00ff58', '#00ff58', '#00ff58', '#00ff58']} 
    start={{ x: 0, y: 0 }} 
    end={{ x: 1, y: 1 }}
    style={styles.programItemDayContainer}
  >
    <MaterialIcons name="calendar-today" size={24} color="#F1FAEE" />
    <Text style={styles.programItemDayText}>{getWeekDayStr(Number(day))}</Text>
  </LinearGradient>
);

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
            colors={['#2A954F', '#2A954F']}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <LinearGradient
            colors={['#2A954F', '#2A954F']}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>
        <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{program.title}</Text>
    </View>
    <FlatList
  horizontal
  data={Object.entries(organizedData)}
  renderItem={({ item: [day, items] }) => (
    <View key={day} style={{ marginRight: 0 }}>
      <ProgramDayContainer day={day} />
      <FlatList
        data={items}
        renderItem={({ item }) => renderProgramItem(item)}
        keyExtractor={item => item.descHora}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={styles.listFooterStyle}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      />
    </View>
  )}
  keyExtractor={item => item[0]}
/>
    <View style={styles.backIconContainer}>
      <Pressable onPress={onPressBackAction} style={styles.buttonBack}>
        <MaterialIcons name="arrow-back-ios" size={40} color="#fff" />
      </Pressable>
    </View>
      </View>
    </>
  );
}

