import { ReactNode } from "react";

export type PhonebookList = {
  contact: Phonebook[];
};

export type Phonebook = {
  created_at: string;
  first_name: string;
  id?: number;
  last_name: string;
  phones: PhoneNumber[];
  is_favorite?: boolean;
};

export type PhoneNumber = {
  number: string;
};

export type searchQuery = {
  limit: number;
  offset:  number;
  order_by?: {
    id: string;
  };
  where?: any;
};

export type PhonebookProviderProps = {
  children: ReactNode;
}

export type PhonebookContextType = {
  updateSearchQuery: (data : any) => void;
  resetSearchQuery: () => void;
  loading: boolean;
}


export type PhonebookContext = {
  contact: Phonebook[];
  offset: number;
  offset_favorite: number;
  search_text?: string;
  favorite_list?: number[];
  limit: number;
};
