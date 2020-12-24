import { waitForElement } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { addCreateTextRangePolyfill } from "../../utils/TestPolyfill";
import DataVisualize from "../DataVisualize";

jest.mock("axios");

function before() {
  addCreateTextRangePolyfill();
  Object.defineProperty(window, "scrollTo", {
    value: () => {},
    writable: true,
  });
  return { search: "" };
}

test("DataVisualize - shows data", async () => {
  const location = before();
  const { queryByText, queryAllByRole } = render(
    <DataVisualize location={location} />
  );
  // Page title
  const title = await waitForElement(() => queryByText(/Visualize RDF data/i));
  expect(title).toBeInTheDocument();
  // 3 input tabs
  const tabs = await waitForElement(() => queryAllByRole("tab"));
  expect(tabs.length === 3);
  // Data format selector
  const dataFormat = await waitForElement(() => queryByText(/^Data format$/i));
  expect(dataFormat).toBeInTheDocument();
  // Data graph format selector
  const targetDataFormat = await waitForElement(() =>
    queryByText(/Target visualization format/i)
  );
  expect(targetDataFormat).toBeInTheDocument();
  // Submit btn
  const btn = await waitForElement(() => queryByText(/^Visualize$/i));
  expect(btn).toBeInTheDocument();
});

test("DataVisualize - attempt submit data", async () => {
  const location = before();
  const { queryByText, queryAllByText } = render(
    <DataVisualize location={location} />
  );
  const rdfTextArea = document.querySelector("textarea");
  const submitBtn = queryByText(/^Visualize$/i);

  // submit empty form
  fireEvent.click(submitBtn);
  expect(axios.post).toHaveBeenCalledTimes(0);
  let errors = await waitForElement(() => queryAllByText(/No rdf/i));
  expect(errors.length === 1);

  // submit form
  fireEvent.change(rdfTextArea, { target: { value: "rdf data" } });
  expect(rdfTextArea.value).toBe("rdf data")
  fireEvent.click(submitBtn);
  errors = await waitForElement(() => queryAllByText(/Error/i));
  expect(errors.length === 0);
});
