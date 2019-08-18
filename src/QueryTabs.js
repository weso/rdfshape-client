import React from 'react';
import InputTabs from "./InputTabs";
import SelectDataFormat from "./SelectFormat";

class QueryTabs extends React.Component {
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

    handleDataFormatChange(e) {
        this.props.handleDataFormatChange(e.target.value);
    }

    render() {
        return (
            <div>
                <InputTabs name="SPARQL"
                           activeTab={this.props.activeTab}
                           textAreaValue={this.props.textAreaValue}
                           byTextPlaceholder="SELECT..."
                           handleByTextChange={this.props.handleByTextChange}
                           handleTabChange={this.props.handleTabChange}
                           byURLPlaceholder="http://..."
                />
            </div>
        );
    }
}

export default QueryTabs;