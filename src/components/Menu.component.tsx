import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Linking, Button, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { MaterialCommunityIcons, MaterialIcons, Entypo } from 'react-native-vector-icons';
import Pressable from './Pressable.component';
import Text from './Text.component';
import { language } from '../languages';
import { Fonts } from '../styles/fonts.style';

const termsOptions = [
  { value: 'https://livecenter.host/politica/', label: 'Politicas de privacidade' },
  { value: "https://livecenter.host/termo/", label: 'Termos de uso' },
];



type MenuProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onPressNews: () => void;
  onPressProgram: () => void;
  onPressTvStream: () => void;
};

const Menu = (props: MenuProps) => {
  const { menu } = language;
  const { visible, setVisible, onPressNews, onPressProgram, onPressTvStream } =
    props;
    
  const [selectedTermsOption, setSelectedTermsOption] = useState(termsOptions[0].value);

  const localPressNews = () => {
    onPressNews();
    setVisible(false);
  };

  const localPressProgram = () => {
    onPressProgram();
    setVisible(false);
  };

  const localPressTvStream = () => {
    onPressTvStream();
    setVisible(false);
  };

  const localPressBack = () => {
    setVisible(false);
  };

  const xPosition = useSharedValue(-400);
  useEffect(() => {
    xPosition.value = withTiming(visible ? 0 : -400, {
      duration: 200,
    });
  }, [visible]);
  const animatedPosition = useAnimatedStyle(() => {
    return {
      left: xPosition.value,
    };
  });

  const openURL = (termurl: string | undefined) => {
    const url = termurl ?? "https://livecenter.host/planos/"

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log(`Não foi possível abrir a URL: ${url}`);
        }
      })
      .catch((err) => console.error('Ocorreu um erro:', err));
  };

const CustomButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

  const styles = StyleSheet.create({
   dropdown: {
    flex: 1, // Isso permite que o dropdown se expanda para preencher o espaço disponível, mas você pode ajustar conforme necessário
    padding: 7,
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    height: 55, 
	width: '50%',
	marginRight: -25,
	top: 40,
	
  },
  button: {
    backgroundColor: '#041584', // Cor do botão
    padding: 5, // Espaçamento interno para aumentar a altura
    borderRadius: 10, // Aredondamento das bordas
    justifyContent: 'center', // Alinha o texto verticalmente
    alignItems: 'center', // Alinha o texto horizontalmente
    height: 60, // Altura específica do botão
    width: '50%', // Largura específica do botão, ajuste conforme necessário
    alignSelf: 'center', // Centraliza o botão na tela ou no container
		top: 40,

  },
  buttonText: {
    color: '#FFFFFF', // Cor do texto
    fontSize: 24, // Tamanho do texto
	
	
  },
    container: {
  position: 'absolute',
  top: 0,
  height: '65%',
  width: 220,
  padding: 24,
  borderBottomRightRadius: 40,
  backgroundColor: 'rgba(42, 149, 79, 0.9)', // 50% de transparência
  overflow: 'visible',
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 10,
  shadowOffset: {
    height: 0,
    width: 2,
  },
  elevation: 3,
},

    menuOptionContainer: {
      width: '100%',
      height: 56,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    menuOption: {
      fontSize: 24,
      lineHeight: 28,
      color: '#FFFFFF',
      fontFamily: Fonts.Tajawal_700Bold,
      textAlign: 'left',
    },
    backIconContainer: {
      position: 'absolute',
      top: '14%',
      right: -24,
      height: 48,
      width: 48,
      borderRadius: 25,
      paddingLeft: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00ff58', //cor do botão voltar menu
    },

 footer: {
 right: 30,
  position: 'absolute',
  bottom: 0,
  width: '100%',
  alignItems: 'center', // centraliza horizontalmente
  justifyContent: 'center', // centraliza verticalmente
  flexDirection: 'column', // dispor os elementos verticalmente
},
  logo: {
    width: 70,  // 100 pixels de largura
    height: 70, // 100 pixels de altura
    top: '20%',
    resizeMode: 'contain', // Mantém as proporções da imagem enquanto a redimensiona
  },
   footerText: {
    top: '-20%',
    right: '-20%',
    marginTop: 10,  // ou qualquer outro valor que lhe pareça bom
    color: '#ffff', // cor do texto
    fontSize: 14,  // ou qualquer outro valor que lhe pareça bom
    fontFamily: Fonts.Tajawal_700Bold,
	alignItems: 'center', // centraliza horizontalmente
    justifyContent: 'center', // centraliza verticalmente
  },

  });

return (
  <Animated.View style={[styles.container, animatedPosition]}>
    <Pressable style={styles.menuOptionContainer} onPress={localPressNews}>
	
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Entypo name="news" size={25} color="#FFFFFF" style={{ marginRight: 7, marginTop: '-5%', }} /> 
    <Text style={styles.menuOption}>{menu.news}</Text>
  </View>
    </Pressable>
    <Pressable style={styles.menuOptionContainer} onPress={localPressProgram}>
	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <MaterialCommunityIcons name="progress-clock" size={25} color="#FFFFFF" style={{ marginRight: 7, marginTop: '-5%', }} /> 
      <Text style={styles.menuOption}>{menu.program}</Text>
	   </View>
    </Pressable>
    <Pressable
      style={styles.menuOptionContainer}
      onPress={localPressTvStream}>
	<View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <MaterialIcons name="online-prediction" size={30} color="#FFFFFF" style={{ marginRight: 7, marginTop: '-5%', }} /> 
      <Text style={styles.menuOption}>{menu.tvStream}</Text>
	   </View>
    </Pressable>
    <Pressable style={styles.backIconContainer} onPress={localPressBack}>
      <MaterialIcons name="arrow-back-ios" size={40} color="#FFFFFF" />
    </Pressable>
  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10}}>
        <Dropdown
        style={styles.dropdown}
        value={selectedTermsOption}
        onChange={item => setSelectedTermsOption(item.value)}
        data={termsOptions}
        labelField="label"
        valueField="value"
      />
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CustomButton
        onPress={() => openURL(selectedTermsOption)}
        title=">"
      />
	
    </View>
    </View>
      <View style={styles.footer}>
        <Pressable onPress={openURL}>
          <Image
            source={require('../../assets/live.png')}  // Substitua './caminho-para-o-logo.png' pelo caminho real para o arquivo da imagem do logo
            style={styles.logo}
          />
        </Pressable>
        <Pressable style={styles.menuOptionContainer} onPress={localPressNews}>
          <Text style={styles.footerText}>
            Desenvolvedor{'\n'}LIVE CENTER HOST</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

};

export default Menu;


