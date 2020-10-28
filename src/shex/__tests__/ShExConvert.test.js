import { waitForElement } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { addCreateTextRangePolyfill } from "../../utils/TestPolyfill";
import ShExConvert from "../ShExConvert";

jest.mock("axios");

function before() {
  addCreateTextRangePolyfill();
  Object.defineProperty(window, "scrollTo", {
    value: () => {},
    writable: true,
  });
  return { search: "" };
}

test("ShExConvert - shows data", async () => {
  const location = before();
  const { queryByText, queryAllByRole } = render(
    <ShExConvert location={location} />
  );
  // Page title
  const title = await waitForElement(() => queryByText(/Convert ShEx schema/i));
  expect(title).toBeInTheDocument();
  // 3 input tabs
  const tabs = await waitForElement(() => queryAllByRole("tab"));
  expect(tabs.length === 3);
  // Data format selector
  const dataFormat = await waitForElement(() => queryByText(/^ShEx format$/i));
  expect(dataFormat).toBeInTheDocument();
  // Data target format selector
  const targetDataFormat = await waitForElement(() =>
    queryByText(/Target schema format/i)
  );
  expect(targetDataFormat).toBeInTheDocument();
  // Submit btn
  const btn = await waitForElement(() => queryByText(/^Convert$/i));
  expect(btn).toBeInTheDocument();
});

test("ShExConvert - submit data", async () => {
  const location = before();
  const { queryByText, queryAllByText } = render(<ShExConvert location={location} />);
  const shexTextArea = [...document.querySelectorAll("textarea")].filter(
    (el) => el.style.display != "none"
  )[0];
  const submitBtn = queryByText(/^Convert$/i);

  // submit empty form
  fireEvent.click(submitBtn);
  expect(axios.post).toHaveBeenCalledTimes(0);
  let errors = await waitForElement(() => queryAllByText(/No shex/i));
  expect(errors.length === 1);

  // submit form
  fireEvent.change(shexTextArea, { target: { value: "shex data" } });
  expect(shexTextArea.value).toBe("shex data")
  fireEvent.click(submitBtn);
  errors = await waitForElement(() => queryAllByText(/Error/i));
  expect(errors.length === 0);
});
