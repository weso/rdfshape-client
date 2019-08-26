import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import API from "./API"
import PropTypes from 'prop-types';

class DataTabs extends React.Component {
    render() {
        return (
            <div>
            <InputTabsWithFormat
                       nameInputTab="RDF data"
                       activeTab={this.props.activeTab}
                       handleTabChange={this.props.handleTabChange}

                       byTextName="RDF data"
                       textAreaValue={this.props.textAreaValue}
                       byTextPlaceholder="RDF data..."
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

DataTabs.propTypes = {
    activeTab: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    handleDataUrlChange: PropTypes.func.isRequired,
    dataFormat: PropTypes.string.isRequired,
    handleDataFormatChange: PropTypes.func.isRequired
};

DataTabs.defaultProps = {
    activeTab: 'ByText',
    dataFormat: 'TURTLE'
};


export default DataTabs;