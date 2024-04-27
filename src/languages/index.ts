import * as languages from './languages';
import { LanguageType } from './types.language';

export function getLanguage(): LanguageType {
  return languages.ptBR;
}

export const language = getLanguage();

