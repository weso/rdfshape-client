import React from "react";

import {render, fireEvent} from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import {waitForElement, getByRole} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import DataInfo from "../../data/DataInfo";

jest.mock("axios");

function before() {
    addCreateTextRangePolyfill();
    return {search: ""};
}

test("ResultDataInfo - shows results after data submit", async () => {

    const location = before();
    const {getByText, container} = render(<DataInfo location={location}/>);

    // submit empty form
    fireEvent.click(getByText(/info about/i));

    expect(axios.post).toHaveBeenCalledTimes(1);

    // Expect permalink
    let permalinkElement = await waitForElement(() => getByText(/permalink/i));
    expect(permalinkElement).toBeInTheDocument();

    // Expect alert with results
    let resultsElement = await waitForElement(() => getByRole(container, "alert"));
    expect(resultsElement).toBeInTheDocument();
});
