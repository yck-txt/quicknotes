export enum NoteType {
  NOTE = 'NOTE',
  CODE = 'CODE',
  RECIPE = 'RECIPE',
}

export interface Note {
  id: number;
  type: NoteType;
  title: string;
  content: string;
  createdAt: string;
  language?: string;
}