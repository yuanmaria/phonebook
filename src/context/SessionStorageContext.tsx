"use client";
import { PhonebookContext } from "@/common/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Create a context
interface SessionStorageContextType {
  sessionData: PhonebookContext | null;
  saveDataToSessionStorage: (newData: PhonebookContext) => void;
  clearDataFromSessionStorage: () => void;
}

const SessionStorageContext = createContext<
  SessionStorageContextType | undefined
>(undefined);

// Create a provider component
interface SessionStorageProviderProps {
  children: ReactNode;
}

export const SessionStorageProvider: React.FC<SessionStorageProviderProps> = ({
  children,
}) => {
  // State to manage data
  const [sessionData, setData] = useState<PhonebookContext | null>(() => {
    // Load data from session storage on component mount
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("phonebook");
      return storedData ? JSON.parse(storedData) : null;
    }
  });

  // Function to save data to session storage
  const saveDataToSessionStorage = (newData: PhonebookContext) => {
    const storedData = sessionStorage.getItem("phonebook");
    const prevData = storedData ? JSON.parse(storedData) : [];
    if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
        setData(newData);
        sessionStorage.setItem("phonebook", JSON.stringify(newData));
      }
  };

  // Function to clear data from session storage
  const clearDataFromSessionStorage = () => {
    setData(null);
    sessionStorage.removeItem("phonebook");
  };

  return (
    <SessionStorageContext.Provider
      value={{ sessionData, saveDataToSessionStorage, clearDataFromSessionStorage }}
    >
      {children}
    </SessionStorageContext.Provider>
  );
};

// Create a custom hook to use the context
export const useSessionStorage = () => {
  const context = useContext(SessionStorageContext);
  if (!context) {
    throw new Error(
      "useSessionStorage must be used within a SessionStorageProvider"
    );
  }
  return context;
};
