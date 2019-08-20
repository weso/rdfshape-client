import React from 'react';
import InputTabs from "./InputTabs";
import PropTypes from "prop-types";

class QueryTabs extends React.Component {
    render() {
        return (
            <div>
                <InputTabs name="SPARQL"
                           activeTab={this.props.activeTab}
                           handleTabChange={this.props.handleTabChange}

                           byTextName="Input Query"
                           textAreaValue={this.props.textAreaValue}
                           handleByTextChange={this.props.handleByTextChange}
                           byTextPlaceholder="SELECT..."

                           byUrlName="URL query"
                           urlValue={this.props.urlValue}
                           handleUrlChange={this.props.handleUrlChange}
                           byUrlPlaceholder="http://..."

                           byFileName="Query file"
                           handleFileUpload={this.props.handleFileUpload}

                />
            </div>
        );
    }
}

QueryTabs.propTypes = {
    activeTab: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    urlValue: PropTypes.string,
    handleDataUrlChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
};

QueryTabs.defaultProps = {
    textAreaValue: '',
    urlValue: '',
    activeTab: 'ByText'
};

export default QueryTabs;