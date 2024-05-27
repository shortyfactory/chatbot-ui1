import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_AZ = 'gpt-35-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview', // Ajout du nouvel identifiant de modèle
  //GPT_4o = 'gpt-4o', // Ajout du nouvel identifiant de modèle
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_3_5_AZ]: {
    id: OpenAIModelID.GPT_3_5_AZ,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
    maxLength: 24000,
    tokenLimit: 8000,
  },
  [OpenAIModelID.GPT_4_32K]: {
    id: OpenAIModelID.GPT_4_32K,
    name: 'GPT-4-32K',
    maxLength: 96000,
    tokenLimit: 32000,
  },
  [OpenAIModelID.GPT_4_TURBO_PREVIEW]: { // Définition des propriétés du nouveau modèle
    id: OpenAIModelID.GPT_4_TURBO_PREVIEW,
    name: 'gpt-4-turbo',
    maxLength: 128000, // Hypothèse sur la maxLength
    tokenLimit: 128000, // Hypothèse sur le tokenLimit
  },
  // [OpenAIModelID.GPT_4o]: { // Définition des propriétés du nouveau modèle
  //   id: OpenAIModelID.GPT_4o,
  //   name: 'GPT_4o',
  //   maxLength: 128000, // Hypothèse sur la maxLength
  //   tokenLimit: 128000, // Hypothèse sur le tokenLimit
  // },
};
