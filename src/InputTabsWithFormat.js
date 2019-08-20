import React from 'react';
import InputTabs from "./InputTabs";
import SelectFormat from "./SelectFormat";
import PropTypes from "prop-types";

class InputTabsWithFormat extends React.Component {
    render() {
        return (
            <div>
            <InputTabs name={this.props.nameInputTab}
                       activeTab={this.props.activeTab}
                       handleTabChange={this.props.handleTabChange}

                       byTextName={this.props.byTextName}
                       textAreaValue={this.props.textAreaValue}
                       handleByTextChange={this.props.handleByTextChange}
                       byTextPlaceholder={this.props.byTextPlaceholder}

                       byUrlName={this.props.byUrlName}
                       urlValue={this.props.urlValue}
                       handleUrlChange={this.props.handleUrlChange}
                       byUrlPlaceholder={this.props.byUrlPlaceholder}

                       byFileName={this.props.byFileName}
                       handleFileUpload={this.props.handleFileUpload}
            />
            <SelectFormat name={this.props.nameFormat}
                              defaultFormat={this.props.defaultFormat}
                              handleFormatChange={this.props.handleFormatChange}
                              urlFormats={this.props.urlFormats}
            />
            </div>
        );
    }
}

InputTabsWithFormat.propTypes = {
    nameInputTab: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    handleTabChange: PropTypes.func.isRequired,
    byTextName: PropTypes.string,
    textAreaValue: PropTypes.string,
    handleByTextChange: PropTypes.func.isRequired,
    byTextPlaceholder: PropTypes.string,
    byUrlName: PropTypes.string.isRequired,
    urlValue: PropTypes.string.isRequired,
    handleUrlChange: PropTypes.func.isRequired,
    byUrlPlaceholder: PropTypes.string,
    byFileName: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    nameFormat: PropTypes.string.isRequired,
    defaultFormat: PropTypes.string.isRequired,
    handleFormatChange: PropTypes.func.isRequired,
    urlFormats: PropTypes.string.isRequired,
};

InputTabsWithFormat.defaultProps = {
    activeTab: 'ByText',
    byTextName: '',
    byTextPlaceholder: '',
    byUrlName: '',
    byUrlPlaceholder: '',
    byFileName: ''
};


export default InputTabsWithFormat;