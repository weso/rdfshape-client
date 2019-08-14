import React from 'react';
import InputTabs from "./InputTabs";

class DataTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }

    render() {
        return (
            <InputTabs name="RDF data"
                       textAreaValue={this.props.textAreaValue}
                       byTextPlaceholder="RDF data..."
                       valueTextArea=""
                       handleByTextChange={this.props.handleByTextChange}
                       byURLPlaceholder="http://..."
            />
        );
    }
}

export default DataTabs;