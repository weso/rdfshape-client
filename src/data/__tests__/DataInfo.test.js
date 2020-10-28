import { waitForElement } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { addCreateTextRangePolyfill } from "../../utils/TestPolyfill";
import DataInfo from "../DataInfo";

jest.mock("axios");

function before() {
  addCreateTextRangePolyfill();
  Object.defineProperty(window, "scrollTo", {
    value: () => {},
    writable: true,
  });
  return { search: "" };
}

test("DataInfo - shows data", async () => {
  const location = before();
  const { getByText } = render(<DataInfo location={location} />);
  const element = await waitForElement(() => getByText(/Data Info/i));
  expect(element).toBeInTheDocument();
});

test("DataInfo - attempts data submit", async () => {
  const location = before();
  const { queryByText, queryAllByText, container } = render(
    <DataInfo location={location} />
  );
  const rdfTextArea = document.querySelector("textarea");
  const submitBtn = queryByText(/^info about data$/i);

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
