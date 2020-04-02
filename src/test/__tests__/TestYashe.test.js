import React from "react";

import {render, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {waitForElement} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import TestYashe from "../TestYashe";

function before() {
    addCreateTextRangePolyfill();
    return {search: ""};
}

test("Test Yashe", async () => {

    const location = before();
    const {queryByText, queryAllByRole} = render(<TestYashe location={location}/>);
    // Page title
    const selectInput = await waitForElement(() => queryByText(/Select Input/i));
    expect(selectInput).toBeInTheDocument();

});
