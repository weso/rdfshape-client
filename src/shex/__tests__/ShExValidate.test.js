import React from 'react'

import {render, fireEvent} from '@testing-library/react';
import ShExValidate from "../ShExValidate";
import '@testing-library/jest-dom/extend-expect'
import {waitForElement} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import axios from "axios";

function before() {
    addCreateTextRangePolyfill();
    return {search: ''};
}

test("ShExValidate - shows data", async () => {

    const location = before();
    const {queryByText, queryAllByRole} = render(<ShExValidate location={location}/>);
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
    const shapemapFormat = await waitForElement(() => queryByText(/^ShapeMap format$/i));
    expect(shapemapFormat).toBeInTheDocument();
    // Submit btn
    const btn = await waitForElement(() => queryByText(/^Validate$/i));
    expect(btn).toBeInTheDocument();
});

test("ShExValidate - submit data and show results after data submit", async () => {

    const location = before();
    const {queryByText, queryAllByText} = render(<ShExValidate location={location}/>);

    // submit form
    fireEvent.click(queryByText(/^Validate$/i));
    expect(axios.post).toHaveBeenCalledTimes(1);


    // Expect validated on success or an error on failure
    const errors = await waitForElement(() => queryAllByText(/error/i));
    expect(errors.length === 0);

    // Expect permalink
    expect(queryByText(/permalink/i)).toBeInTheDocument();
});
