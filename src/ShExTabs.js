import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import ShExForm from "./ShExForm";
import API from "./API";
import PropTypes from "prop-types";

class ShExTabs extends React.Component {
    render() {
        const shExForm =
            <ShExForm id="textAreaShEx"
                      onChange={this.props.handleByTextChange}
                      value={this.props.textAreaValue}
            />
        return (
            <div>
                <InputTabsWithFormat
                    nameInputTab="ShEx input"
                    activeTab={this.props.activeTab}
                    handleTabChange={this.props.handleTabChange}

                    byTextName="RDF shEx"
                    textAreaValue={this.props.textAreaValue}
                    byTextPlaceholder="RDF shEx..."
                    handleByTextChange={this.props.handleByTextChange}
                    inputForm = {shExForm}

                    byUrlName="ShEx URL"
                    handleUrlChange={this.props.handleShExUrlChange}
                    urlValue={this.props.shExUrl}
                    byURLPlaceholder="http://..."

                    byFileName="ShEx File"
                    handleFileUpload={this.props.handleFileUpload}

                    nameFormat="ShEx format"
                    defaultFormat={this.props.shExFormat}
                    handleFormatChange={this.props.handleShExFormatChange}
                    urlFormats={API.shExFormats}
                />
            </div>
        );
    }
}

ShExTabs.propTypes = {
    activeTab: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    handleShExUrlChange: PropTypes.func.isRequired,
    shExFormat: PropTypes.string.isRequired,
    handleShExFormatChange: PropTypes.func.isRequired
};

ShExTabs.defaultProps = {
    activeTab: 'ByText',
    shExFormat: 'TURTLE'
};


export default ShExTabs;