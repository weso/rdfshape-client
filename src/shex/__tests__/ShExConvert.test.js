import React from 'react'

import {render, fireEvent} from '@testing-library/react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'
import {waitForElement} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import ShExConvert from "../ShExConvert";

jest.mock('axios');

function before() {
    addCreateTextRangePolyfill();
    return {search: ''};
}

test("ShExConvert - shows data", async () => {

    const location = before();
    const {queryByText, queryAllByRole} = render(<ShExConvert location={location}/>);
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
    const targetDataFormat = await waitForElement(() => queryByText(/Target schema format/i));
    expect(targetDataFormat).toBeInTheDocument();
    // Submit btn
    const btn = await waitForElement(() => queryByText(/^Convert$/i));
    expect(btn).toBeInTheDocument();
});

test("ShExConvert - submit data and show permalink after data submit", async () => {

    const location = before();
    const {queryByText} = render(<ShExConvert location={location}/>);

    // submit form
    fireEvent.click(queryByText(/^Convert$/i));

    expect(axios.post).toHaveBeenCalledTimes(1);

    // Expect permalink on success or an error on failure
    let resultElement;
    try {
        resultElement = await waitForElement(() => queryByText(/permalink/i));
        expect(queryByText(/permalink/i)).toBeInTheDocument();
    }
    catch (e) {
        resultElement = await waitForElement(() => queryByText(/error/i));
        expect(queryByText(/error/i)).toBeInTheDocument();
    }
});
