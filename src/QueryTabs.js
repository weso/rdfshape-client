import React from 'react';
import InputTabs from "./InputTabs";

class QueryTabs extends React.Component {
    render() {
        return (
            <InputTabs name="SPARQL query"
                       byTextPlaceholder="select..."
                       byURLPlaceholder="http://..."
            />
        );
    }
}

export default QueryTabs;