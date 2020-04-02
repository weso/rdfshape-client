import React from "react";

import {render, fireEvent} from "@testing-library/react";
import ShExForm from "../ShExForm";
import '@testing-library/jest-dom/extend-expect'
import {waitForElement} from "@testing-library/dom";
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";
import axios from "axios";

function before() {
    addCreateTextRangePolyfill();
    return {search: ""};
}

test("ShExForm - shows data", async () => {
    const value = "prefix : <http://example.org>\n:S { :p . }";
//    const changeFn = () => { return ; }

});

