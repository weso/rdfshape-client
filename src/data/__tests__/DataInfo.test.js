import React from 'react'

import {render, fireEvent} from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import DataInfo from "../DataInfo";
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect'
import {wait, waitForElement, getByText} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";

jest.mock('axios');

function before() {
    addCreateTextRangePolyfill();
    return {search: ''};
}

test("DataInfo - shows data", async () => {

    const location = before();
    const {getByText} = render(<DataInfo location={location}/>);
    const element = await waitForElement(() => getByText(/Data Info/i));
    expect(element).toBeInTheDocument();
});

test("DataInfo - submit data and show permalink after data submit", async () => {

    const location = before();
    const {getByText} = render(<DataInfo location={location}/>);

    // submit empty form
    fireEvent.click(getByText(/info about/i));

    expect(axios.post).toHaveBeenCalledTimes(1);

    // Expect permalink
    let permalinkElement = await waitForElement(() => getByText(/permalink/i));
    expect(permalinkElement).toBeInTheDocument();
    let dataInfoElement = await waitForElement(() => getByText(/Data Info/i));
    expect(dataInfoElement).toBeInTheDocument();
});
