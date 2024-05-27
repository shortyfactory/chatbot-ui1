import { useCallback, useContext, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { saveConversation, saveConversations } from '@/utils/app/conversation';
import { saveFolders } from '@/utils/app/folders';
import { exportData, importData } from '@/utils/app/importExport';

import { Conversation } from '@/types/chat';
import { LatestExportFormat, SupportedExportFormats } from '@/types/export';
import { OpenAIModels } from '@/types/openai';
import { PluginKey } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { ChatFolders } from './components/ChatFolders';
import { ChatbarSettings } from './components/ChatbarSettings';
import { Conversations } from './components/Conversations';

import Sidebar from '../Sidebar';
import ChatbarContext from './Chatbar.context';
import { ChatbarInitialState, initialState } from './Chatbar.state';

import { v4 as uuidv4 } from 'uuid';

export const Chatbar = () => {
  const { t } = useTranslation('sidebar');

  const chatBarContextValue = useCreateReducer<ChatbarInitialState>({
    initialState,
  });

  const {
    state: { conversations, showChatbar, defaultModelId, folders, pluginKeys },
    dispatch: homeDispatch,
    handleCreateFolder,
    handleNewConversation,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const {
    state: { searchTerm, filteredConversations },
    dispatch: chatDispatch,
  } = chatBarContextValue;

  const handleApiKeyChange = useCallback(
    (apiKey: string) => {
      homeDispatch({ field: 'apiKey', value: apiKey });

      localStorage.setItem('apiKey', apiKey);
    },
    [homeDispatch],
  );

  const handlePluginKeyChange = (pluginKey: PluginKey) => {
    if (pluginKeys.some((key) => key.pluginId === pluginKey.pluginId)) {
      const updatedPluginKeys = pluginKeys.map((key) => {
        if (key.pluginId === pluginKey.pluginId) {
          return pluginKey;
        }

        return key;
      });

      homeDispatch({ field: 'pluginKeys', value: updatedPluginKeys });

      localStorage.setItem('pluginKeys', JSON.stringify(updatedPluginKeys));
    } else {
      homeDispatch({ field: 'pluginKeys', value: [...pluginKeys, pluginKey] });

      localStorage.setItem(
        'pluginKeys',
        JSON.stringify([...pluginKeys, pluginKey]),
      );
    }
  };

  const handleClearPluginKey = (pluginKey: PluginKey) => {
    const updatedPluginKeys = pluginKeys.filter(
      (key) => key.pluginId !== pluginKey.pluginId,
    );

    if (updatedPluginKeys.length === 0) {
      homeDispatch({ field: 'pluginKeys', value: [] });
      localStorage.removeItem('pluginKeys');
      return;
    }

    homeDispatch({ field: 'pluginKeys', value: updatedPluginKeys });

    localStorage.setItem('pluginKeys', JSON.stringify(updatedPluginKeys));
  };

  const handleExportData = () => {
    exportData();
  };



  // Fonction pour convertir les données du nouveau format vers l'ancien
function convertToOldFormat(typingmindData: any) {
    const additionalFields: any = {
        model: {
            id: "gpt-4",
            name: "GPT-4",
            maxLength: 24000,
            tokenLimit: 8000
        },
        prompt: "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
        temperature: 0.7,
        folderId: null
    };

    let transformedData: any = {
        version: 4,
        history: [],
        folders: [],
        prompts: []
    };

    typingmindData.data.chats.forEach((chatData: any) => {
        let newHistoryItem: any = {
            id: chatData.chatID,
            name: chatData.chatTitle,
            messages: chatData.messages
                .filter((message: any) => message.role !== "system")
                .map((message: any) => ({ role: message.role, content: message.content }))
        };

        newHistoryItem = { ...newHistoryItem, ...additionalFields };
        transformedData.history.push(newHistoryItem);
    });

    return transformedData;
}

  
  
  
  // Hypothétique fonction adaptée pour traiter SupportedExportFormats
function convertToOldFormat2(newData: any) {
    const additionalFields: any = {
        model: {
            id: "gpt-4",
            name: "GPT-4",
            maxLength: 24000,
            tokenLimit: 8000
        },
        prompt: "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
        temperature: 0.7,
        folderId: null
    };

    let oldFormatData: any = {
        version: 4,
        history: [],
        folders: [],
        prompts: []
    };

    newData.forEach((item: any) => {
        let newHistoryItem: any = {
            id: item.conversation_id,
            name: item.title,
            messages: [],
            ...additionalFields
        };

        for (let key in item.mapping) {
            let node: any = item.mapping[key];
            if (node.message) {
                let messageRole: any = node.message.author.role === 'system' ? 'assistant' : node.message.author.role;
                let messageContent: any;

                // Vérifier le type de contenu
                if (node.message.content && node.message.content.parts) {
                    // Si le contenu est de type texte, joindre les parties du texte
                    messageContent = node.message.content.parts.join(" ");
                } else if (node.message.content && node.message.content.result) {
                   // Si le contenu est de type tether_quote, utiliser le texte avec les balises appropriées
                    if (node.message.content.text) {
                        messageContent = `${node.message.content.text.trim()}\n\n${node.message.content.title}\n\n${node.message.content.domain}\n\n${node.message.content.url}`;
                    }
                }

                // Ajouter le message seulement s'il n'est pas vide
                if (messageContent && messageContent.trim()) {
                    newHistoryItem.messages.push({
                        role: messageRole,
                        content: messageContent
                    });
                }
            }
        }

        oldFormatData.history.push(newHistoryItem);
    });

    return oldFormatData;
}


  
  const handleImportConversations = (data: SupportedExportFormats) => {
  try {
    let processedData = data;
    // Check and transform the data based on its format
    if (isValidOriginalFormat(data)) {
      //alert("OLD FORMAT");
      processedData = data;
    } else if (isNewFormat(data)) {
      //alert("NEW FORMAT");
      processedData = convertToOldFormat(data);
    } else if (isNewFormat2(data)) {
      //alert("NEW FORMAT 2");
      processedData = convertToOldFormat2(data);
    } else {
      throw new Error("Unsupported file format");
    }
    

    const { history, folders, prompts }: LatestExportFormat = importData(processedData);

    // Existing dispatch calls
    homeDispatch({ field: 'conversations', value: history });
    homeDispatch({
      field: 'selectedConversation',
      value: history[history.length - 1],
    });
    homeDispatch({ field: 'folders', value: folders });
    homeDispatch({ field: 'prompts', value: prompts });

    window.location.reload();
 } catch (error) {
     if (error instanceof Error) {
        // Display an alert with the error message
        alert("Error importing data: " + error.message);
      } else {
        // Handle cases where the error is not an instance of Error
        alert("An unknown error occurred during data import.");
      }
  }
};
  


// Placeholder function for the original format validation
function isValidOriginalFormat(data: any): boolean {
  // Check if all required fields are present and of the correct type
  if (typeof data.version !== 'number') {
    return false;
  }
  if (!Array.isArray(data.history)) {
    return false;
  }
  if (!Array.isArray(data.folders)) {
    return false;
  }
  if (!Array.isArray(data.prompts)) {
    return false;
  }

  // Add any additional specific checks for each field if necessary
  // For example, checking the structure of objects inside the arrays

  return true;
}

// Placeholder function for the new format validation
function isNewFormat(data: any): boolean {
  // Check if the top-level structure matches
  if (typeof data.checksum !== 'string') {
    return false;
  }
  if (typeof data.data !== 'object' || data.data === null || Array.isArray(data.data)) {
    return false;
  }

  // Add any additional specific checks for the 'data' dictionary
  // For example, checking the keys and types of values within the 'data' object

  return true;
}


function isNewFormat2(data: any): boolean {
  // Vérifie si 'data' est un tableau
  if (!Array.isArray(data)) {
    return false;
  }

  // Vérifie chaque élément du tableau
  for (const item of data) {
    // Vérifie les propriétés de base
    if (typeof item.title !== 'string' || typeof item.create_time !== 'number' || typeof item.update_time !== 'number') {
      return false;
    }

    // Vérifie la structure du 'mapping'
    if (typeof item.mapping !== 'object' || item.mapping === null) {
      return false;
    }

    // Vous pouvez ajouter d'autres vérifications spécifiques ici
    // Par exemple, vérifier la structure détaillée des objets dans 'mapping'
    // ...

  }

  return true; // Retourne 'true' si toutes les vérifications sont passées
}
  
  const handleClearConversations = () => {
    defaultModelId &&
      homeDispatch({
        field: 'selectedConversation',
        value: {
          id: uuidv4(),
          name: t('New Conversation'),
          messages: [],
          model: OpenAIModels[defaultModelId],
          prompt: DEFAULT_SYSTEM_PROMPT,
          temperature: DEFAULT_TEMPERATURE,
          folderId: null,
        },
      });

    homeDispatch({ field: 'conversations', value: [] });

    localStorage.removeItem('conversationHistory');
    localStorage.removeItem('selectedConversation');

    const updatedFolders = folders.filter((f) => f.type !== 'chat');

    homeDispatch({ field: 'folders', value: updatedFolders });
    saveFolders(updatedFolders);
  };

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id,
    );

    homeDispatch({ field: 'conversations', value: updatedConversations });
    chatDispatch({ field: 'searchTerm', value: '' });
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      homeDispatch({
        field: 'selectedConversation',
        value: updatedConversations[updatedConversations.length - 1],
      });

      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      defaultModelId &&
        homeDispatch({
          field: 'selectedConversation',
          value: {
            id: uuidv4(),
            name: t('New Conversation'),
            messages: [],
            model: OpenAIModels[defaultModelId],
            prompt: DEFAULT_SYSTEM_PROMPT,
            temperature: DEFAULT_TEMPERATURE,
            folderId: null,
          },
        });

      localStorage.removeItem('selectedConversation');
    }
  };

  const handleToggleChatbar = () => {
    homeDispatch({ field: 'showChatbar', value: !showChatbar });
    localStorage.setItem('showChatbar', JSON.stringify(!showChatbar));
  };

  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, { key: 'folderId', value: 0 });
      chatDispatch({ field: 'searchTerm', value: '' });
      e.target.style.background = 'none';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations.filter((conversation) => {
          const searchable =
            conversation.name.toLocaleLowerCase() +
            ' ' +
            conversation.messages.map((message) => message.content).join(' ');
          return searchable.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      chatDispatch({
        field: 'filteredConversations',
        value: conversations,
      });
    }
  }, [searchTerm, conversations]);

  return (
    <ChatbarContext.Provider
      value={{
        ...chatBarContextValue,
        handleDeleteConversation,
        handleClearConversations,
        handleImportConversations,
        handleExportData,
        handlePluginKeyChange,
        handleClearPluginKey,
        handleApiKeyChange,
      }}
    >
      <Sidebar<Conversation>
        side={'left'}
        isOpen={showChatbar}
        addItemButtonTitle={t('New chat')}
        itemComponent={<Conversations conversations={filteredConversations} />}
        folderComponent={<ChatFolders searchTerm={searchTerm} />}
        items={filteredConversations}
        searchTerm={searchTerm}
        handleSearchTerm={(searchTerm: string) =>
          chatDispatch({ field: 'searchTerm', value: searchTerm })
        }
        toggleOpen={handleToggleChatbar}
        handleCreateItem={handleNewConversation}
        handleCreateFolder={() => handleCreateFolder(t('New folder'), 'chat')}
        handleDrop={handleDrop}
        footerComponent={<ChatbarSettings />}
      />
    </ChatbarContext.Provider>
  );
};
