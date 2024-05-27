import { OpenAIModel } from './openai';

export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  model: OpenAIModel;
  folderId: string | null;
  disableActions?:boolean;
  placeholders?: { [key: string]: string }; // Add this line
}
