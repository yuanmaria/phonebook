/**
 * @jest-environment jsdom
 */
import React from "react";
import { act, render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  SessionStorageProvider,
  useSessionStorage,
} from "./SessionStorageContext";
import { PhonebookContext } from "@/constants/types";

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

test("useSessionStorage returns the correct context value", () => {
  const TestComponent: React.FC = () => {
    const contextValue = useSessionStorage();
    return <div>{contextValue ? "Context Found" : "Context Not Found"}</div>;
  };

  render(
    <SessionStorageProvider>
      <TestComponent />
    </SessionStorageProvider>
  );

  expect(screen.getByText("Context Found")).toBeInTheDocument();
});

const wrapper = ({ children }: any) => (
  <SessionStorageProvider>{children}</SessionStorageProvider>
);

it("should render correctly", () => {
  const { result } = renderHook(() => useSessionStorage(), {
    wrapper,
  });

  expect(result.current.sessionData).toEqual(null);
});

test('saveDataToSessionStorage updates sessionData and sessionStorage', () => {
    const TestComponent: React.FC = () => {
      const { saveDataToSessionStorage, sessionData } = useSessionStorage();

      sessionStorageMock.removeItem('phonebook');
  
      const handleSaveData = async () => {
        await act(async () => {
            saveDataToSessionStorage({ offset: 10 } as PhonebookContext);
          });
      };
  
      return (
        <div>
          <div data-testid="session-data">{sessionData?.offset ? 'Data Found' : 'Data Not Found'}</div>
          <button onClick={handleSaveData}>Save Data</button>
        </div>
      );
    };
  
    render(
      <SessionStorageProvider>
        <TestComponent />
      </SessionStorageProvider>
    );
  
    expect(screen.getByTestId('session-data').textContent).toBe('Data Not Found');
  
    const saveButton = screen.getByText('Save Data');
    saveButton.click();
  
    expect(screen.getByTestId('session-data').textContent).toBe('Data Not Found');
    expect(sessionStorageMock.getItem('phonebook')).toBe('{"offset":10}');
  });
  
  test('clearDataFromSessionStorage clears sessionData and sessionStorage', () => {
    const TestComponent: React.FC = () => {
      const { clearDataFromSessionStorage, sessionData } = useSessionStorage();
  
      const handleClearData = async() => {
        await act(async () => {
            clearDataFromSessionStorage();
          });
        
      };
  
      return (
        <div>
          <div data-testid="session-data">{sessionData?.offset ? 'Data Found' : 'Data Not Found'}</div>
          <button onClick={handleClearData}>Clear Data</button>
        </div>
      );
    };
  
    sessionStorageMock.setItem('phonebook', '{"offset":10}');
  
    render(
      <SessionStorageProvider>
        <TestComponent />
      </SessionStorageProvider>
    );
  
    expect(screen.getByTestId('session-data').textContent).toBe('Data Found');
  
    const clearButton = screen.getByText('Clear Data');
    clearButton.click();
  
    expect(screen.getByTestId('session-data').textContent).toBe('Data Found');
    expect(sessionStorageMock.getItem('phonebook')).toBeNull();
  });
