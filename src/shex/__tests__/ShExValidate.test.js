import React from 'react'

import {render, fireEvent} from '@testing-library/react';
// import { renderHook, act } from '@testing-library/react-hooks';
import ShExValidate from "../ShExValidate";
import '@testing-library/jest-dom/extend-expect'
import {waitForElement} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";

test('ShExValidate - shows data', async () => {

    addCreateTextRangePolyfill();

    const location = {search: ''};
    const {getAllByText} = render(<ShExValidate location={location}/>);
    const element = await waitForElement(() => getAllByText(/ShEx/i))
    expect(element[0]).toBeInTheDocument();

});
