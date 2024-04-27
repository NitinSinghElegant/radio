import { AppConfigType } from '../../App';

export type ProgramItem = {
  codDiaDaSemana: number;
  descHora: string;
  descNome: string;
  descLocutor: string;
};

export type RootStackParamList = {
  Main: AppConfigType;
  TvStream: {
    tvStream: string;
	radioPub1Url: string;
	radioPub2Url: string;
	radioPub3Url: string;
    radioInstagram: string;
    radioFacebook: string;
    radioWpp: string;
    radioSite: string;
	radioYoutube: string;
    admobBannerId: string;
  };
  News: {
    newsUrl: string;
  };
  Program: {
    programList: ProgramItem[];
  };
};

