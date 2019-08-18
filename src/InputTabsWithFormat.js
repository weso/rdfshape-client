import React from 'react';
import InputTabs from "./InputTabs";
import SelectFormat from "./SelectFormat";

class InputTabsWithFormat extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }

    handleTabChange(e) {
        this.props.handleTabChange(e.target.value);
    }

    handleUrlChange(e) {
        this.props.handleUrlChange(e.target.value);
    }

    handleFormatChange(e) {
        console.log("HandleFormatChange in InputTabsWithForm" + e);
        this.props.handleFormatChange(e.target.value);
    }

    render() {
        return (
            <div>
            <InputTabs name={this.props.nameInputTab}
                       activeTab={this.props.activeTab}
                       handleTabChange={this.props.handleTabChange}

                       byTextName={this.props.byTextName}
                       textAreaValue={this.props.textAreaValue}
                       handleByTextChange={this.props.handleByTextChange}
                       byTextPlaceholder={this.props.byTextPlaceHolder}

                       byUrlName={this.props.byUrlName}
                       urlValue={this.props.urlValue}
                       handleUrlChange={this.props.handleUrlChange}
                       byUrlPlaceholder={this.props.byUrlPlaceHolder}

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

export default InputTabsWithFormat;