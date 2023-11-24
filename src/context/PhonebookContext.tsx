"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  Phonebook,
  PhonebookContext,
  PhonebookContextType,
  PhonebookProviderProps,
  searchQuery,
} from "@/constants/types";
import { GET_CONTACT_LIST, PER_PAGE } from "@/constants/Queries";
import { useLazyQuery } from "@apollo/client";
import { useSessionStorage } from "./SessionStorageContext";

// Create a context
const PhonebookContext = createContext<PhonebookContextType | undefined>(
  undefined
);

export const PhonebookProvider: React.FC<PhonebookProviderProps> = ({
  children,
}) => {
  const [getPhonebookList, { data: _contactData, loading, error }] =
    useLazyQuery(GET_CONTACT_LIST, { fetchPolicy: "network-only" });
  const { sessionData, saveDataToSessionStorage } = useSessionStorage();

  const callGetPhonebookList = useCallback((query: searchQuery) => {
    return new Promise<Phonebook[]>((resolve, reject) => {
      getPhonebookList({ variables: query })
        .then((res) => {
          resolve(res.data?.contact || []);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }, []);

  const fetchData = async (data: PhonebookContext | null) => {
    const searchText = data?.search_text || "";
    const favoriteList = data?.favorite_list || [];
    const offsetFavorite = data?.offset_favorite || 0;
    const offset = data?.offset || 0;
    let renderedList = data?.contact || [];
    let limit = data?.limit || PER_PAGE; //normalData count to query

    if (renderedList.length == 0) {
      let favList: Phonebook[] = [];
      if (favoriteList.length && offsetFavorite < favoriteList.length) {
        favList = await callGetPhonebookList(
          createQuery(
            PER_PAGE + 1,
            offsetFavorite,
            favoriteList,
            searchText,
            true
          )
        );
        favList = favList.map((val) => {
          return { ...val, is_favorite: true };
        });
      }

      let normalList: Phonebook[] = [];
      limit = PER_PAGE + 1 - favList.length; // partially have favorite
      if (limit > 0) {
        normalList = await callGetPhonebookList(
          createQuery(limit, offset, favoriteList, searchText, false)
        );
      }

      renderedList = [...favList, ...normalList];

      const storageData: PhonebookContext = {
        contact: renderedList,
        offset,
        offset_favorite: offsetFavorite,
        favorite_list: favoriteList,
        search_text: searchText,
        limit: limit,
      };
      saveDataToSessionStorage(storageData);
    }
  };

  useEffect(() => {
    if (!sessionData) {
      fetchData(sessionData);
    }
  }, [sessionData]);

  const updateSearchQuery = useCallback((data: any) => {
    fetchData({ contact: [], ...data } as PhonebookContext);
  }, []);

  const resetSearchQuery = useCallback(() => {
    const queryData = {
      offset: 0,
      offset_favorite: 0,
      search_text: "",
      limit: 0,
      favorite_list: sessionData?.favorite_list || [],
      contact: [],
    } as PhonebookContext;
    fetchData(queryData as PhonebookContext);
  }, []);

  const createQuery = (
    limit: number = PER_PAGE + 1,
    offset: number = 0,
    favList: number[] = [],
    searchText: string = "",
    shouldQueryFavorite: boolean = false
  ) => {
    const query: searchQuery = {
      limit,
      offset,
      order_by: { id: "desc" },
      where: {},
    };

    query.where = {};
    if (searchText) {
      query.where = {
        _or: [
          { first_name: { _ilike: `%${searchText}%` } },
          { last_name: { _ilike: `%${searchText}%` } },
        ],
      };
    }
    if (favList.length) {
      query.where.id = shouldQueryFavorite
        ? { _in: favList }
        : { _nin: favList };
    }
    return query;
  };

  //memoize context value
  const providerValue = useMemo(
    () => ({
      updateSearchQuery,
      resetSearchQuery,
      loading,
    }),
    [updateSearchQuery, resetSearchQuery, loading]
  );

  return (
    <PhonebookContext.Provider value={{ ...providerValue }}>
      {children}
    </PhonebookContext.Provider>
  );
};

//custom hook to use phonebook context
export const usePhonebook = () => {
  const context = useContext(PhonebookContext);
  if (!context) {
    throw new Error("usePhonebook must be used within a PhonebookProvider");
  }
  return context;
};
