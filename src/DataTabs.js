import React from 'react';
import InputTabs from "./InputTabs";
import SelectDataFormat from "./SelectDataFormat";
import Form from "react-bootstrap/Form";

class DataTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }

    handleTabChange(e) {
        this.props.handleTabChange(e.target.value);
    }

    render() {
        return (
            <div>
            <InputTabs name="RDF data"
                       activeTab={this.props.activeTab}
                       textAreaValue={this.props.textAreaValue}
                       byTextPlaceholder="RDF data..."
                       valueTextArea=""
                       handleByTextChange={this.props.handleByTextChange}
                       handleTabChange={this.props.handleTabChange}
                       byURLPlaceholder="http://..."
            />
            <SelectDataFormat name="Data format"/>
            </div>
        );
    }
}

export default DataTabs;