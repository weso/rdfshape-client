import React from 'react';
import InputTabsWithFormat from "./InputTabsWithFormat";
import API from "./API";

class ShExTabs extends React.Component {
    constructor(props) {
        super(props);
        this.handleByTextChange = this.handleByTextChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
    }

    handleByTextChange(e) {
        this.props.handleByTextChange(e.target.value);
    }

    handleTabChange(e) {
        this.props.handleTabChange(e.target.value);
    }

    handleFormatChange(e) {
        this.props.handleShExFormatChange(e.target.value);
    }

    render() {
        return (
            <div>
                <InputTabsWithFormat
                    name="ShEx schema"
                    activeTab={this.props.activeTab}
                    textAreaValue={this.props.textAreaValue}
                    byTextPlaceholder="<Shape> {..."
                    handleByTextChange={this.props.handleByTextChange}
                    handleTabChange={this.props.handleTabChange}
                    byURLPlaceholder="http://..."
                    nameFormat="ShEx format"
                    defaultFormat={this.props.shExFormat}
                    handleFormatChange={this.props.handleShExFormatChange}
                    urlFormats={API.shExFormats}
                />
            </div>
        );
    }
}

export default ShExTabs;