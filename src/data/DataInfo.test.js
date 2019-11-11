import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import DataInfo from "./DataInfo";
import '@testing-library/jest-dom/extend-expect'

test('shows data', () => {
    const testMessage = 'RDF Data Info'
    const {queryByText, getByLabelText, getByText} = render(
        <DataInfo location.search="?data='<x> <p> 1." />,
    )

    // query* functions will return the element or null if it cannot be found
    // get* functions will return the element or throw an error if it cannot be found
    expect(queryByText(testMessage)).toBeNull()

    // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
    fireEvent.click(getByLabelText(/show/i))

    // .toBeInTheDocument() is an assertion that comes from jest-dom
    // otherwise you could use .toBeDefined()
    expect(getByText(testMessage)).toBeInTheDocument()
})