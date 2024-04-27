type MainType = {
  stopped: string;
  paused: string;
  buffering: string;
  playing: string;
  watch: string;
};

type ShareType = {
  message: string;
  title: string;
  dialogTitle: string;
  subject: string;
};

type MenuType = {
  news: string;
  program: string;
  tvStream: string;
};

type ProgramType = {
  title: string;

  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
};

type NewsType = {
  title: string;
};

type TvStreamType = {
  title: string;
  watching: string;
};

export type LanguageType = {
  main: MainType;
  share: ShareType;
  menu: MenuType;
  program: ProgramType;
  news: NewsType;
  tvStream: TvStreamType;
};

