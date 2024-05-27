import { Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { OpenAIModel, OpenAIModelID } from '@/types/openai';
import { PluginKey } from '@/types/plugin';
import { Prompt } from '@/types/prompt';

export interface HomeInitialState {
  apiKey: string;
  pluginKeys: PluginKey[];
  loading: boolean;
  lightMode: 'light' | 'dark';
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  models: OpenAIModel[];
  folders: FolderInterface[];
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  currentMessage: Message | undefined;
  prompts: Prompt[];
  temperature: number;
  showChatbar: boolean;
  showPromptbar: boolean;
  currentFolder: FolderInterface | undefined;
  messageError: boolean;
  searchTerm: string;
  defaultModelId: OpenAIModelID | undefined;
  serverSideApiKeyIsSet: boolean;
  serverSidePluginKeysSet: boolean;
}


export const initialState: HomeInitialState = {
  apiKey: '',
  loading: false,
  pluginKeys: [],
  lightMode: 'light',
  messageIsStreaming: false,
  modelError: null,
  models: [],
  folders: [{ "id": "0", "name": "Prompt Library", "type": "prompt", "disableActions": true},],
  conversations: [],
  selectedConversation: undefined,
  currentMessage: undefined,
  prompts: [
    {
      id: '1',
      name: 'Rewriting',
      description: 'Rewrite text with specific focus & provide alternative formulations',
      content: 'Rewrite the {{provided text}} with a focus on {{specific aspect}}, and provide {{number of alternative}} alternative formulations that convey the same message differently.',
      model: {
        id: 'gpt-4',
        name: 'GPT-4',
        maxLength: 2048, // Example value, adjust as needed
        tokenLimit: 4096, // Example value, adjust as needed
      },
      folderId: '0',
      disableActions: true,
      placeholders: { // Add custom placeholders here
        'provided text': 'Enter the text to be rewritten...',
        'specific aspect': 'Describe the special aspect to focus...',
        'number of alternative': 'Enter the number of alternatives you would like to generate...',
      },
    },
    {
      id: '2',
      name: 'Translating+',
      description: 'Translate with additional aspects',
      content: 'Translate the {{provided text}} into {{target language}}, and incorporate additional information about {{specified aspect}} that aligns with the provided context.',
      model: {
        id: 'gpt-4',
        name: 'GPT-4',
        maxLength: 2048, // Example value, adjust as needed
        tokenLimit: 4096, // Example value, adjust as needed
      },
      folderId: '0',
      disableActions: true,
      placeholders: { // Add custom placeholders here
        'provided text': 'Enter the text to be translated...',
        'target language': 'Enter the target language...',
        'specified aspect': 'Enter the additional aspect...',
      },
    },
    {
      id: '3',
      name: 'Textblock Merging',
      description: 'Amalgamation of various textblocks',
      content: 'Combine the {{provided text}} text blocks into a cohesive piece, ensuring smooth transitions and a unified theme focused on {{specified theme}}. In addition, elaborate on the following aspects {{describe aspect}}.',
      model: {
        id: 'gpt-4',
        name: 'GPT-4',
        maxLength: 2048, // Example value, adjust as needed
        tokenLimit: 4096, // Example value, adjust as needed
      },
      folderId: '0',
      disableActions: true,
      placeholders: { // Add custom placeholders here
        'provided text': 'Enter the text blocks to merge...',
        'target language': 'Describe the special theme to focus ...',
        'specified aspect': 'Enter the additional aspect...',
      },
    },    
    {
      id: '4',
      name: 'Format - Table',
      description: 'Restructure outputs text to table',
      content: 'Restructure the {{provided text}} into a table format. It has {{number of columns}} columns with the following titles {{columns title separate by a coma}}.',
      model: {
        id: 'gpt-4',
        name: 'GPT-4',
        maxLength: 2048, // Example value, adjust as needed
        tokenLimit: 4096, // Example value, adjust as needed
      },
      folderId: '0',
      disableActions: true,
      placeholders: { // Add custom placeholders here
        'provided text': 'Enter the text to restructure...',
        'number of columns': 'Enter the number of columns...',
        'columns title separate by a coma': 'Enter the title of the columns...',
      },
    },    
    {
      id: '5',
      name: 'Format - Bulletpoints',
      description: 'Restructure outputs text to bullet points for slide',
      content: 'Please rewrite the {{provided text}} in {{number of bullet-points}} bullet-points.',
      model: {
        id: 'gpt-4',
        name: 'GPT-4',
        maxLength: 2048, // Example value, adjust as needed
        tokenLimit: 4096, // Example value, adjust as needed
      },
      folderId: '0',
      disableActions: true,
      placeholders: { // Add custom placeholders here
        'provided text': 'Enter the text to restructure...',
        'number of bullet-points': 'Enter the number of bullet-points...',
      },
    }, 
    // More prompts...
  ],
  temperature: 0.7,
  showPromptbar: true,
  showChatbar: true,
  currentFolder: undefined,
  messageError: false,
  searchTerm: '',
  defaultModelId: undefined,
  serverSideApiKeyIsSet: false,
  serverSidePluginKeysSet: false,
};
