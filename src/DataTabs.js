import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import API from "./API"
import InputTabs from "./InputTabs";

class DataTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleDataFormatChange = this.handleDataFormatChange.bind(this);
        this.handleDataUrlChange = this.handleDataUrlChange.bind(this);
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }

    handleDataUrlChange(e) {
        this.props.handleDataUrlChange(e.target.value);
    }

    handleTabChange(e) {
        this.props.handleTabChange(e.target.value);
    }

    handleDataFormatChange(e) {
        console.log("HandleDataFormatChange in InputTabsWithForm" + e);
        this.props.handleDataFormatChange(e.target.value);
    }

    render() {
        return (
            <div>
            <InputTabsWithFormat
                       nameInputTab="RDF data"
                       activeTab={this.props.activeTab}
                       handleTabChange={this.props.handleTabChange}

                       byTextName="RDF data"
                       textAreaValue={this.props.textAreaValue}
                       textPlaceholder="RDF data..."
                       handleByTextChange={this.props.handleByTextChange}

                       byUrlName="URL data"
                       handleUrlChange={this.props.handleDataUrlChange}
                       urlValue={this.props.dataUrl}
                       byURLPlaceholder="http://..."

                       byFileName="RDF File"
                       handleFileUpload={this.props.handleFileUpload}

                       nameFormat="Data format"
                       defaultFormat={this.props.dataFormat}
                       handleFormatChange={this.props.handleDataFormatChange}
                       urlFormats={API.dataFormats}
            />
            </div>
        );
    }
}

export default DataTabs;