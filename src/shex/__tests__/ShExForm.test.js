import React from "react";

import '@testing-library/jest-dom/extend-expect'
import {addCreateTextRangePolyfill} from "../../utils/TestPolyfill";

function before() {
    addCreateTextRangePolyfill();
    return {search: ""};
}

test("ShExForm - shows data", async () => {
    const value = "prefix : <http://example.org>\n:S { :p . }";
//    const changeFn = () => { return ; }

});

