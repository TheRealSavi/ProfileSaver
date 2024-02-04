export interface Collection {
  name: string;
  profiles?: string[];
}

export interface Card {
  primaryColor: string;
  accentColor: string;
  avatarUrl?: string;
  bannerUrl?: string;
  name: string;
  username: string;
  aboutMe: string;
  createdUnix?: string;
  getImagesFromID?: string;
}

export interface CollectionData {
  id: string;
  content: Collection;
}

export interface CardData {
  id: string;
  content: Card;
}
export interface UserSettings {
  defaultImportID: string;
  botToken: string;
}
