import React from 'react'

import {render, fireEvent} from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'

import DataInfo from "../DataInfo";
import '@testing-library/jest-dom/extend-expect'

test('DataInfo - shows data', () => {
    const testMessage = 'RDF Data Info'
    const location = {search: '?data=pepe'};
/*    global.document = {
        createRange: () => {
            return {
                setEnd: () => {
                },
                setStart: () => {
                },
                getBoundingClientRect: () => {
                }
            }
        }
    }; */


    /* Code taken from: https://stackoverflow.com/questions/21572682/createtextrange-is-not-working-in-chrome/41743191#41743191
     global.document.createRange = () => {
        return {
            setEnd: () => {},
            setStart: () => {},
            getBoundingClientRect: () => {}
        }
    }; */

    /* https://stackoverflow.com/questions/42099385/jest-enzyme-jsdom-document-body-createtextrange-is-not-a-function */
    /* The following code comes from: https://stackoverflow.com/questions/42213522/mocking-document-createrange-for-jest */
    global.Range = function Range() {};

    const createContextualFragment = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0];
    };

    Range.prototype.createContextualFragment = (html) => createContextualFragment(html);
    // HACK: Polyfil that allows codemirror to render in a JSDOM env.

    global.document.body.createTextRange = function () {
        return {
            setEnd: () => {},
            setStart: () => {},
            getBoundingClientRect: () => {
                return { right: 0 };
            },
            getClientRects: () => [],
            createContextualFragment,
        };
    };
    const {queryByText, getByLabelText, getByText} = render(
        <DataInfo location={location}/>
    );

    // query* functions will return the element or null if it cannot be found
    // get* functions will return the element or throw an error if it cannot be found
    // expect(queryByText(testMessage)).toBeNull()

    // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
    // fireEvent.click(getByLabelText(/show/i))

    // .toBeInTheDocument() is an assertion that comes from jest-dom
    // otherwise you could use .toBeDefined()
    // expect(getByText(testMessage)).toBeInTheDocument()
})