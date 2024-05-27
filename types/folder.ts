export interface FolderInterface {
  id: string;
  name: string;
  type: FolderType;
  disableActions?:boolean;
}

export type FolderType = 'chat' | 'prompt';
