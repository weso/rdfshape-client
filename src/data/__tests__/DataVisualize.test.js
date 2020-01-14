import React from "react";

import {render, fireEvent} from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import {waitForElement} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import DataVisualize from "../DataVisualize";

jest.mock("axios");

function before() {
    addCreateTextRangePolyfill();
    return {search: ""};
}

test("DataVisualize - shows data", async () => {

    const location = before();
    const {queryByText, queryAllByRole} = render(<DataVisualize location={location}/>);
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
    const targetDataFormat = await waitForElement(() => queryByText(/Target graph format/i));
    expect(targetDataFormat).toBeInTheDocument();
    // Submit btn
    const btn = await waitForElement(() => queryByText(/^Visualize$/i));
    expect(btn).toBeInTheDocument();
});

test("DataVisualize - submit data and show permalink after data submit", async () => {

    const location = before();
    const {queryByText} = render(<DataVisualize location={location}/>);

    // submit form
    fireEvent.click(queryByText(/^Visualize$/i));

    expect(axios.post).toHaveBeenCalledTimes(1);

    // Expect permalink on success or an error on failure
    let resultElement;
    try {
        resultElement = await waitForElement(() => queryByText(/permalink/i));
    }
    catch (e) {
        resultElement = await waitForElement(() => queryByText(/error/i));
    }
    expect(resultElement).toBeInTheDocument();
});
