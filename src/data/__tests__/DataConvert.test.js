import { waitForElement } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { addCreateTextRangePolyfill } from "../../utils/TestPolyfill";
import DataConvert from "../DataConvert";

jest.mock("axios");

function before() {
  addCreateTextRangePolyfill();
  Object.defineProperty(window, "scrollTo", {
    value: () => {},
    writable: true,
  });
  return { search: "" };
}

test("DataConvert - shows data", async () => {
  const location = before();
  const { queryByText, queryAllByRole } = render(
    <DataConvert location={location} />
  );
  // Page title
  const title = await waitForElement(() => queryByText(/Convert RDF data/i));
  expect(title).toBeInTheDocument();
  // 3 input tabs
  const tabs = await waitForElement(() => queryAllByRole("tab"));
  expect(tabs.length === 3);
  // Data format selector
  const dataFormat = await waitForElement(() => queryByText(/^Data format$/i));
  expect(dataFormat).toBeInTheDocument();
  // Data target format selector
  const targetDataFormat = await waitForElement(() =>
    queryByText(/Target data format/i)
  );
  expect(targetDataFormat).toBeInTheDocument();
  // Submit btn
  const btn = await waitForElement(() => queryByText(/Convert data/i));
  expect(btn).toBeInTheDocument();
});

test("DataConvert - attemp data submit", async () => {
  const location = before();
  const { queryByText, queryAllByText } = render(<DataConvert location={location} />);
  const rdfTextArea = document.querySelector("textarea");
  const submitBtn = queryByText(/^Convert data$/i);

  // submit empty form
  fireEvent.click(submitBtn);
  expect(axios.post).toHaveBeenCalledTimes(0);
  let errors = await waitForElement(() => queryAllByText(/No Rdf/i));
  expect(errors.length === 1);

  // submit form
  fireEvent.change(rdfTextArea, { target: { value: "rdf data" } });
  expect(rdfTextArea.value).toBe("rdf data");
  fireEvent.click(submitBtn);
  errors = await waitForElement(() => queryAllByText(/Error/i));
  expect(errors.length === 0);
});
