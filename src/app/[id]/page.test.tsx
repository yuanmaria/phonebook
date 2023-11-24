/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page";
import CrudComponent from "../../components/CrudComponent";

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => mockRouterPush,
    };
  },
}));

jest.mock("../../components/CrudComponent", () => jest.fn(() => null));

test("renders Page component correctly", () => {
  const mockProps = {
    params: { id: "123" },
    searchParams: {},
  };

  render(<Page {...mockProps} />);

  expect(
    screen.getByText("Edit Phone Book Project Assignment")
  ).toBeInTheDocument();

  expect(CrudComponent).toHaveBeenCalledTimes(1);
});
