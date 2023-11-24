/**
 * @jest-environment jsdom
 */
import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PhonebookProvider, usePhonebook } from "./PhonebookContext";
import { SessionStorageProvider } from "./SessionStorageContext";
import { GET_CONTACT_LIST } from "@/constants/Queries";
import { MockedProvider } from "@apollo/client/testing";

const mocks = [
  {
    request: {
      query: GET_CONTACT_LIST,
      variables: { limit: 11, offset: 0, order_by: { id: "desc" }, where: {} },
    },
    result: {
      data: {
        contact: [
          {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            phones: [],
            created_at: "",
          },
        ],
      },
    },
  },
];

test("usePhonebook returns the correct context value", () => {
  const TestComponent: React.FC = () => {
    const contextValue = usePhonebook();
    return <div>{contextValue ? "Context Found" : "Context Not Found"}</div>;
  };

  render(
    <SessionStorageProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <PhonebookProvider>
          <TestComponent />
        </PhonebookProvider>
      </MockedProvider>
    </SessionStorageProvider>
  );

  expect(screen.getByText("Context Found")).toBeInTheDocument();
});
beforeEach(() => {
  jest.clearAllMocks();
});

test("updateSearchQuery updates the search query correctly", async () => {
  const TestComponent: React.FC = () => {
    const { updateSearchQuery, loading } = usePhonebook();

    const handleUpdateSearch = async () => {
      await act(
        async () =>
          await waitFor(() => {
            updateSearchQuery({ search_text: "Test" });
          })
      );
    };

    return (
      <div>
        <div data-testid="loading">{loading ? "Loading" : "Not Loading"}</div>
        <button onClick={handleUpdateSearch}>Update Search</button>
      </div>
    );
  };

  render(
    <SessionStorageProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <PhonebookProvider>
          <TestComponent />
        </PhonebookProvider>
      </MockedProvider>
    </SessionStorageProvider>
  );

  expect(screen.getByTestId("loading").textContent).toBe("Loading");

  // Trigger the button click to update search query
  const updateButton = screen.getByText("Update Search");
  updateButton.click();

  // Wait for the loading state to change
  await waitFor(() =>
    expect(screen.getByTestId("loading").textContent).toBe("Loading")
  );
  await waitFor(() =>
    expect(screen.getByTestId("loading").textContent).toBe("Not Loading")
  );
});

test("resetSearchQuery resets the search query correctly", async () => {
  const TestComponent: React.FC = () => {
    const { resetSearchQuery, loading } = usePhonebook();

    const handleResetSearch = async () => {
      await act(
        async () =>
          await waitFor(() => {
            resetSearchQuery();
          })
      );
    };

    return (
      <div>
        <div data-testid="loading">{loading ? "Loading" : "Not Loading"}</div>
        <button onClick={handleResetSearch}>Reset Search</button>
      </div>
    );
  };

  render(
    <SessionStorageProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <PhonebookProvider>
          <TestComponent />
        </PhonebookProvider>
      </MockedProvider>
    </SessionStorageProvider>
  );

  expect(screen.getByTestId("loading").textContent).toBe("Not Loading");

  // Trigger the button click to reset search query
  const resetButton = screen.getByText("Reset Search");
  resetButton.click();

  // Wait for the loading state to change
  await waitFor(() =>
    expect(screen.getByTestId("loading").textContent).toBe("Not Loading")
  );
  await waitFor(() =>
    expect(screen.getByTestId("loading").textContent).toBe("Not Loading")
  );
});
