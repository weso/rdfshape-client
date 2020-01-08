import React from 'react'

import {render, fireEvent} from '@testing-library/react';
import DataInfo from "../DataInfo";
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'
import {wait, waitForElement, getByText, getByLabelText} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import DataConvert from "../DataConvert";

jest.mock('axios');

function before() {
    addCreateTextRangePolyfill();
    return {search: ''};
}

test("DataConvert - shows data", async () => {

    const location = before();
    const {queryByText, queryAllByRole} = render(<DataConvert location={location}/>);
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
    const targetDataFormat = await waitForElement(() => queryByText(/Target data format/i));
    expect(targetDataFormat).toBeInTheDocument();
    // Submit btn
    const btn = await waitForElement(() => queryByText(/Convert data/i));
    expect(btn).toBeInTheDocument();
});

test("DataConvert - submit data and show permalink after data submit", async () => {

    const location = before();
    const {queryByText} = render(<DataConvert location={location}/>);

    // submit form
    fireEvent.click(queryByText(/Convert data/i));

    expect(axios.post).toHaveBeenCalledTimes(1);

    // Expect permalink
    const permalinkElement = await waitForElement(() => queryByText(/permalink/i));
    expect(permalinkElement).toBeInTheDocument();
});
