import { waitForElement } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { addCreateTextRangePolyfill } from "../../utils/TestPolyfill";
import ShExValidate from "../ShExValidate";

jest.mock("axios")

function before() {
  addCreateTextRangePolyfill();
  Object.defineProperty(window, "scrollTo", {
    value: () => {},
    writable: true,
  });

  return { search: "" };
}

test("ShExValidate - shows data", async () => {
  const location = before();
  const { queryByText, queryAllByRole } = render(
    <ShExValidate location={location} />
  );
  // Page title
  const title = await waitForElement(() => queryByText(/Validate RDF data/i));
  expect(title).toBeInTheDocument();
  // 3 input tabs for RDF data + 3 input tabs for ShEx input + 3 input tabs for shapemap
  const tabs = await waitForElement(() => queryAllByRole("tab"));
  expect(tabs.length === 9);
  // Data format selector
  const dataFormat = await waitForElement(() => queryByText(/^Data format$/i));
  expect(dataFormat).toBeInTheDocument();
  // ShEx format selector
  const shexFormat = await waitForElement(() => queryByText(/^ShEx format$/i));
  expect(shexFormat).toBeInTheDocument();
  // Shapemap format selector
  const shapemapFormat = await waitForElement(() =>
    queryByText(/^ShapeMap format$/i)
  );
  expect(shapemapFormat).toBeInTheDocument();
  // Submit btn
  const btn = await waitForElement(() => queryByText(/^Validate$/i));
  expect(btn).toBeInTheDocument();
});

test("ShExValidate - attempts data submit", async () => {
  // Setup
  const location = before();
  const { queryByText, queryAllByText, queryByRole } = render(
    <ShExValidate location={location} />
  );
  const textAreas = [...document.querySelectorAll("textarea")].filter(
    (el) => el.style.display != "none"
  );
  const rdfTextArea = textAreas[0];
  const shexTextArea = textAreas[1];
  const shapeMapTextArea = textAreas[2];
  const submitBtn = queryByText(/^Validate$/i);

  // submit empty form
  fireEvent.click(submitBtn);
  expect(axios.post).toHaveBeenCalledTimes(0);
  let errors = await waitForElement(() => queryAllByText(/No RDF/i));
  expect(errors.length === 1);

  // submit incomplete form (only rdf)
  fireEvent.change(rdfTextArea, { target: { value: "rdf data" } });
  expect(rdfTextArea.value).toBe("rdf data")
  fireEvent.click(submitBtn);
  expect(axios.post).toHaveBeenCalledTimes(0);
  errors = await waitForElement(() => queryAllByText(/No ShEx/i));
  expect(errors.length === 1);

  // submit incomplete form (missing shapemap)
  fireEvent.change(shexTextArea, { target: { value: "shex data" } });
  expect(shexTextArea.value).toBe("shex data")
  fireEvent.click(submitBtn);
  expect(axios.post).toHaveBeenCalledTimes(0);
  errors = await waitForElement(() => queryAllByText(/No Shapemap/i));
  expect(errors.length === 1);

  // submit complete form
  fireEvent.change(shapeMapTextArea, { target: { value: "shapemap data" } });
  expect(shapeMapTextArea.value).toBe("shapemap data")
  fireEvent.click(submitBtn);
  errors = await waitForElement(() => queryAllByText(/error/i));
  expect(errors.length === 0);
});
