import { OpenAIModel } from './openai';

// Dans le fichier où l'interface Message est définie
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isNewPrompt?: boolean; // New property
  variables2?: Array<{ name: string; value: string }>; // New property
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
}
